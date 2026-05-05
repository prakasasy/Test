namespace Test.Application.Bussiness.Auth.Commands
{
    public record SignupCommand(
        string Email,
        string Password,
        IList<string> Roles
    ) : ICommand;

    public class SignupCommandValidation : AbstractValidator<SignupCommand>
    {
        public SignupCommandValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-=/\\|]).+$")
                   .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"); ;

            RuleFor(x => x.Roles)
                .NotEmpty().WithMessage("At least one role is required");
        }
    }
}
