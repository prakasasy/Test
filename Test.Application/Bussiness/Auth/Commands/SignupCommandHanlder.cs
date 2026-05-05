using Test.Application.Abstractions.Authentication;

namespace Test.Application.Bussiness.Auth.Commands
{
    public class SignupCommandHanlder(IAuthService authService) : ICommandHandler<SignupCommand>
    {
        public async Task<Unit> Handle(SignupCommand request, CancellationToken cancellationToken)
        {
            await authService.Signup(request.Email, request.Password, request.Roles);
            return Unit.Value;
        }
    }
}
