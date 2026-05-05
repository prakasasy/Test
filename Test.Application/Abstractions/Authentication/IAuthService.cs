using Test.Application.Bussiness.Auth.Dtos;

namespace Test.Application.Abstractions.Authentication
{
    public interface IAuthService
    {
        Task Signup(string email, string password, IList<string> roles);
        Task<AuthResponseDto> Login(string email, string password);
    }
}
