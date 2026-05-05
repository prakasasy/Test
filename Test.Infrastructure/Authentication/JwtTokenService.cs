using Test.Application.Abstractions.Authentication;
using Test.Application.Bussiness.Auth.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Test.Infrastructure.Authentication
{
    public sealed class JwtTokenService (ApplicationDbContext dbContext,
        UserManager<AppUser> _userManager,
        RoleManager<IdentityRole> _roleManager,
        IOptions<JwtOption> jwtOption) : IJwtTokenService
    {
        private readonly JwtOption _jwtOption = jwtOption.Value;

        public string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes);
        }

        public string HashToken(string token)
        {
            using var sha = SHA256.Create();
            var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToHexString(hashBytes);
        }

        public async Task<string> GenerateAccessToken(AppUserDto appUser, List<Claim>? claims = null)
        {
            var expiredToken = DateTime.UtcNow.AddMinutes(_jwtOption.AccessTokenMinutes);
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOption.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claimList = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, appUser.Email!),
                new Claim(JwtRegisteredClaimNames.Sub, appUser.Id!),
            };

            // claims
            if (claims != null)
            {
                foreach (var claim in claims)
                {
                    AddClaimIfNotExists(claimList, claim);
                }
            }

            // roles
            foreach (var role in appUser.Roles.Distinct())
            {
                AddClaimIfNotExists(claimList, new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _jwtOption.Audience,
                Issuer = _jwtOption.Issuer,
                Subject = new ClaimsIdentity(claimList),                
                Expires = expiredToken,
                SigningCredentials = creds
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<bool> SaveRefreshToken(string userId, string refreshToken, DateTime refreshTokenExpiry)
        {
            var refreshTokenHash = HashToken(refreshToken);
            var refreshSession = new RefreshSession
            {
                UserId = userId,
                TokenHash = refreshTokenHash,
                ExpiredAt = refreshTokenExpiry
            };
            
            dbContext.RefreshSessions.Add(refreshSession);
            return await dbContext.SaveChangesAsync() > 0;

        }

        public async Task<AuthResponseDto> RefreshToken(string refreshToken, CancellationToken cancellationToken = default)
        {
            var tokenHash = HashToken(refreshToken);
            var session = await dbContext.RefreshSessions.FirstOrDefaultAsync(s => s.TokenHash == tokenHash, cancellationToken);
            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtOption.AccessTokenMinutes);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtOption.RefreshTokenDays);


            if (session is null)
                return new AuthResponseDto();
                //throw new UnauthorizedException("Refresh token tidak valid.");

            if (session.IsRevoked || session.IsExpired)
            {
                //if (session.IsRevoked && !string.IsNullOrWhiteSpace(session.ReplacedByTokenHash))
                //{
                //    // Optional: deteksi token reuse / suspicious activity
                //}
                return new AuthResponseDto();
                //throw new UnauthorizedException("Refresh token sudah tidak aktif.");
            }

            var newRefreshToken = GenerateRefreshToken();
            var newRefreshTokenHash = HashToken(newRefreshToken);

            session.RevokedAt = DateTime.UtcNow;
            session.ReplacedByTokenHash = newRefreshTokenHash;
            session.RevokeReason = "Rotated";

            var newSession = new RefreshSession
            {
                Id = Guid.NewGuid(),
                UserId = session.UserId,
                TokenHash = newRefreshTokenHash,
                ExpiredAt = refreshTokenExpiry
            };

            dbContext.RefreshSessions.Add(newSession);

            var user = await _userManager.FindByIdAsync(session.UserId) ?? throw new UnauthorizedException(null);
            var roles = await _userManager.GetRolesAsync(user);
            var userClaims = await _userManager.GetClaimsAsync(user);

            var claims = new List<Claim>();

            claims.AddRange(userClaims);

            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);

                if (role != null)
                {
                    var roleClaims = await _roleManager.GetClaimsAsync(role);
                    claims.AddRange(roleClaims);
                }
            }

            var appUserDto = new AppUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                Roles = roles.ToList()
            };

            var newAccessToken = await GenerateAccessToken(appUserDto, claims.ToList());

            await dbContext.SaveChangesAsync(cancellationToken);

            var authResponseDto = new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                AccessTokenExpiry = accessTokenExpiry,
                RefreshTokenExpiry = refreshTokenExpiry
            };

            return authResponseDto;
        }

        public async Task RevokeToken(string refreshToken, CancellationToken cancellationToken = default)
        {
            var tokenHash = HashToken(refreshToken);
            var session = await dbContext.RefreshSessions.FirstOrDefaultAsync(s => s.TokenHash == tokenHash, cancellationToken);

            if (session is null || session.IsRevoked)
                return;

            session.RevokedAt = DateTime.UtcNow;
            session.RevokeReason = "Logout";

            await dbContext.SaveChangesAsync();
        }

        private static void AddClaimIfNotExists(List<Claim> claims, Claim claim)
        {
            if (!claims.Any(x => x.Type == claim.Type && x.Value == claim.Value))
            {
                claims.Add(claim);
            }
        }

    }
}
