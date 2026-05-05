using System;
using System.Collections.Generic;
using System.Text;

namespace Test.Infrastructure.Authentication
{
    public class JwtOption
    {
        public string Secret { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;

        public int AccessTokenMinutes { get; set; } = 15;
        public int RefreshTokenDays { get; set; } = 7;

        public string RefreshCookieName { get; set; } = "refreshToken";
    }
}
