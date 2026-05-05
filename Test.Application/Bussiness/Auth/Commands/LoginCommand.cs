using Test.Application.Bussiness.Auth.Dtos;

namespace Test.Application.Bussiness.Auth.Commands
{
    public record LoginCommand(
        string Email,
        string Password
    ) : ICommand<AuthResponseDto>;

    public class LoginCommandValidation : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}
