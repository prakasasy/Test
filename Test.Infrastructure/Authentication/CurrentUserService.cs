using Test.Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Test.Infrastructure.Authentication
{
    public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
    {
        public ClaimsPrincipal Principal =>
            httpContextAccessor.HttpContext?.User ?? new ClaimsPrincipal(new ClaimsIdentity());
        public bool HasRole(string role) =>
            Roles.Contains(role, StringComparer.OrdinalIgnoreCase);

        public string? UserId => Principal.FindFirstValue("sub")
                ?? Principal.FindFirstValue(ClaimTypes.NameIdentifier);
        public string? UserName => Principal.FindFirstValue("name")
                ?? Principal.FindFirstValue(ClaimTypes.NameIdentifier);
        public bool IsAuthenticated => Principal.Identity?.IsAuthenticated ?? false;
        public IReadOnlyList<string> Roles => Principal?.FindAll(ClaimTypes.Role)
                .Select(x => x.Value)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray() ?? Array.Empty<string>();
    }
}
