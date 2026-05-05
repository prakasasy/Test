using Test.Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Linq.Expressions;
using System.Reflection;

namespace Test.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>, IApplicationDbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private bool _allowHardDelete;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService currentUserService) : base(options)
        {
            _currentUserService = currentUserService;
        }
        public DbSet<RefreshSession> RefreshSessions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // apply configuration classes first so property metadata is present
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // UTC converters
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
                v => v.HasValue ? v.Value.ToUniversalTime() : null,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null
            );

            // apply converters globally but skip properties that already have converters / are keys / shadow props
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.IsPrimaryKey()) continue;
                    if (property.GetValueConverter() != null) continue;

                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }
                    else if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(nullableDateTimeConverter);
                    }
                }
            }

            // Apply a global query filter for ISoftDeletable entities: e => !EF.Property<bool>(e, "IsDeleted")
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;
                if (typeof(ISoftDeletable).IsAssignableFrom(clrType))
                {
                    var parameter = Expression.Parameter(clrType, "e");
                    var propertyMethod = typeof(EF).GetMethod(nameof(EF.Property))!.MakeGenericMethod(typeof(bool));
                    var isDeletedProperty = Expression.Call(propertyMethod, parameter, Expression.Constant(nameof(ISoftDeletable.IsDeleted)));
                    var condition = Expression.Equal(isDeletedProperty, Expression.Constant(false));
                    var lambda = Expression.Lambda(condition, parameter);
                    builder.Entity(clrType).HasQueryFilter(lambda);
                }
            }

            base.OnModelCreating(builder);
        }

        /// <summary>
        /// Begin a short-lived scope that permits hard deletes for the current context.
        /// Use with using(...) so the flag is reset automatically.
        /// using (context.BeginHardDeleteScope()) { context.Remove(entity); await context.SaveChangesAsync(); }
        /// </summary>
        public IDisposable BeginHardDeleteScope()
        {
            _allowHardDelete = true;
            return new DisposeAction(() => _allowHardDelete = false);
        }

        /// <summary>
        /// Convenience helper: hard-delete a tracked or untracked entity immediately.
        /// This will perform a physical delete (bypass soft-delete interception).
        /// Use carefully (audit & permissions).
        /// </summary>
        public async Task HardDeleteAsync<TEntity>(TEntity entity, CancellationToken cancellationToken = default)
            where TEntity : class
        {
            Entry(entity).State = EntityState.Deleted;
            using (BeginHardDeleteScope())
            {
                await SaveChangesAsync(cancellationToken);
            }
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {

            // Intercept deletes and convert them to soft deletes if entity supports ISoftDeletable
            if (!_allowHardDelete)
            {
                var deletedEntries = ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Deleted && e.Entity is ISoftDeletable)
                    .ToList();

                foreach (var entry in deletedEntries)
                {
                    var soft = (ISoftDeletable)entry.Entity;
                    soft.IsDeleted = true;
                    soft.DeletedAt = DateTime.UtcNow;
                    soft.DeletedBy = _currentUserService.UserName ?? "SYSTEM";

                    // mark Modified instead of Deleted so the IsDeleted columns are persisted
                    entry.State = EntityState.Modified;
                }
            }

            // You can also update entities directly here instead of using interceptor
            foreach (var entry in ChangeTracker.Entries<IEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedBy = _currentUserService.UserName ?? "SYSTEM";
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                }

                if (entry.State == EntityState.Added || entry.State == EntityState.Modified || entry.HasChangedOwnedEntities())
                {
                    entry.Entity.LastModifiedBy = _currentUserService.UserName ?? "SYSTEM";
                    entry.Entity.LastModified = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        // small disposable helper to reset the hard-delete flag
        private sealed class DisposeAction : IDisposable
        {
            private readonly Action _onDispose;
            private bool _disposed;

            public DisposeAction(Action onDispose) => _onDispose = onDispose;

            public void Dispose()
            {
                if (_disposed) return;
                _onDispose();
                _disposed = true;
            }
        }


    }
}
