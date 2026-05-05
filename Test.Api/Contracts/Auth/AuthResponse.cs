namespace Test.Api.Contracts.Auth
{
    public class AuthResponse
    {
        public string? AccessToken { get; set; }
        public DateTime AccessTokenExpiry { get; set; }
    }
}
