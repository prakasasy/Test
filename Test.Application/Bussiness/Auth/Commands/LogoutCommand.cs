namespace Test.Application.Bussiness.Auth.Commands
{
    public record LogoutCommand(string refreshToken) : ICommand;
}
