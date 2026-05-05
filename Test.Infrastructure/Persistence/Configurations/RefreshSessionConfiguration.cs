namespace Test.Infrastructure.Persistence.Configurations
{
    public class RefreshSessionConfiguration : IEntityTypeConfiguration<RefreshSession>
    {
        public void Configure(EntityTypeBuilder<RefreshSession> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.TokenHash)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.UserId)
                .IsRequired();

            builder.Property(x => x.ReplacedByTokenHash)
                .HasMaxLength(200);

            builder.Property(x => x.RevokeReason)
                .HasMaxLength(200);

            builder.HasIndex(x => x.TokenHash).IsUnique();

            builder.HasOne<AppUser>()
                .WithMany(x => x.RefreshSessions)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
