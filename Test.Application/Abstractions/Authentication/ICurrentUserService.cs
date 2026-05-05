using System.Security.Claims;

namespace Test.Application.Abstractions.Authentication
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
        string? UserName { get; }
        bool IsAuthenticated { get; }

        IReadOnlyList<string> Roles { get; }
        ClaimsPrincipal Principal { get; }
    }
}
