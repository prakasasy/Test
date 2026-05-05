using Test.Infrastructure.Authentication;
using Microsoft.Extensions.Options;

namespace Test.Api.Helpers
{
    public class RefreshTokenCookieHelper
    {
        private readonly JwtOption _jwtOption;

        public RefreshTokenCookieHelper(IOptions<JwtOption> jwtOption)
        {
            _jwtOption = jwtOption.Value;
        }

        public void SetRefreshTokenCookie(HttpResponse response, string refreshToken, DateTime expiresAtUtc)
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expiresAtUtc
            };

            response.Cookies.Append(_jwtOption.RefreshCookieName, refreshToken, options);
        }

        public void DeleteRefreshTokenCookie(HttpResponse response)
        {
            response.Cookies.Delete(_jwtOption.RefreshCookieName, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
        }
    }
}
