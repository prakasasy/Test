using Microsoft.AspNetCore.Identity;

namespace Test.Infrastructure.Persistence
{
    public class AppUser : IdentityUser
    {
        public string? DisplayName { get; set; }
        public bool IsActive { get; set; } = true;
        public ICollection<RefreshSession> RefreshSessions { get; set; } = new List<RefreshSession>();
    }
}
