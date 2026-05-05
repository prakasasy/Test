using Test.Domain.Abstractions;

namespace Test.Domain.Models
{
    public class RefreshSession : Entity<Guid>
    {
        public RefreshSession()
        {
            Id = Guid.NewGuid();
        }
        public string UserId { get; set; } = default!;
        public string TokenHash { get; set; } = default!;
        public DateTime ExpiredAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string? ReplacedByTokenHash { get; set; }
        public string? RevokeReason { get; set; }

        public bool IsExpired => DateTime.UtcNow >= ExpiredAt;
        public bool IsRevoked => RevokedAt.HasValue;
        public bool IsActive => !IsExpired && !IsRevoked;
    }
}
