using Test.Application.Bussiness.Auth.Dtos;
using System.Security.Claims;

namespace Test.Application.Abstractions.Authentication
{
    public interface IJwtTokenService
    {
        Task<string> GenerateAccessToken(AppUserDto appUser, List<Claim>? claims = null);
        string GenerateRefreshToken();
        string HashToken(string token);
        Task<bool> SaveRefreshToken(string userId, string refreshToken, DateTime refreshTokenExpiry);
        Task<AuthResponseDto> RefreshToken(string refreshToken, CancellationToken cancellationToken = default);
        Task RevokeToken(string refreshToken, CancellationToken cancellationToken = default);
    }
}
