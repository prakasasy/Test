using Test.Application.Abstractions.Authentication;
using Test.Application.Bussiness.Auth.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Test.Infrastructure.Authentication
{
    public sealed class AuthService(
        UserManager<AppUser> _userManager,
        RoleManager<IdentityRole> _roleManager,
        IJwtTokenService _jwtTokenService,
        IOptions<JwtOption> jwtOption
        ) : IAuthService
    {
        private readonly JwtOption _jwtOption = jwtOption.Value;

        public async Task<AuthResponseDto> Login(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) throw new UnauthorizedException("Invalid email/password");

            var result = await _userManager.CheckPasswordAsync(user, password);

            if (!result) throw new UnauthorizedException("Invalid email/password"); ;

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>();

            var userClaims = await _userManager.GetClaimsAsync(user);

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

            AppUserDto userDto = new AppUserDto()
            {
                Id = user.Id,
                Email = user.Email!,
                Roles = roles.ToList()
            };

            var accessToken = await _jwtTokenService.GenerateAccessToken(userDto, claims.ToList());
            var refreshToken = _jwtTokenService.GenerateRefreshToken();
            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtOption.AccessTokenMinutes);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtOption.RefreshTokenDays);

            AuthResponseDto loginResponseDto = new AuthResponseDto()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                AccessTokenExpiry = accessTokenExpiry,
                RefreshTokenExpiry = refreshTokenExpiry
            };

            await _jwtTokenService.SaveRefreshToken(user.Id, refreshToken, refreshTokenExpiry);

            return loginResponseDto;
        }

        public async Task Signup(string email, string password, IList<string> roles)
        {
            AppUser user = new()
            {
                UserName = email,
                Email = email,
                NormalizedEmail = email.ToUpper()
            };

            if (await _userManager.FindByEmailAsync(email) != null)
            {
                throw new BadRequestException("Email is already taken");
            }

            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await _userManager.AddToRolesAsync(user, roles);
            }
            else
            {
                throw new BadRequestException(result.Errors.FirstOrDefault()?.Description);
            }
        }
    }
}
