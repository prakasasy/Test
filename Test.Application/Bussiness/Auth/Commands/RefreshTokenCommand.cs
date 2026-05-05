using Test.Application.Bussiness.Auth.Dtos;

namespace Test.Application.Bussiness.Auth.Commands
{
    public record RefreshTokenCommand(
        string RefreshToken
    ) : ICommand<AuthResponseDto>;

    public class RefreshTokenCommandValidation : AbstractValidator<RefreshTokenCommand>
    {
        public RefreshTokenCommandValidation()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token is required");
        }
    }
}
