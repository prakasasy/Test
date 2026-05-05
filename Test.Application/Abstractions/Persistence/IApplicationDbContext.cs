namespace Test.Application.Abstractions.Persistence
{
    public interface IApplicationDbContext
    {
        DbSet<RefreshSession> RefreshSessions { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
