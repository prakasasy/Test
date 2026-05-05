using Test.Application.Abstractions.Authentication;
using Test.Application.Bussiness.Auth.Dtos;

namespace Test.Application.Bussiness.Auth.Commands
{
    public class LoginCommandHandler(IAuthService authService) : ICommandHandler<LoginCommand, AuthResponseDto>
    {
        public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var response = await authService.Login(request.Email, request.Password);
            return response;
        }
    }
}
