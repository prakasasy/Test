using System;
using System.Collections.Generic;
using System.Text;

namespace Test.Application.Bussiness.Auth.Dtos
{
    public class AuthResponseDto
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime AccessTokenExpiry { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
    }
}
