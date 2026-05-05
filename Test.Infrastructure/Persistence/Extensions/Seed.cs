using Test.Domain.Constants;
using Microsoft.AspNetCore.Identity;

namespace Test.Infrastructure.Persistence.Extensions
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<IdentityRole> _role)
        {
            if (await userManager.Users.AnyAsync()) return;

            var admin = new AppUser
            {
                UserName = "admin@test.com",
                Email = "admin@test.com",
                DisplayName = "Admin"
            };

            var employee = new AppUser
            {
                UserName = "guest1@test.com",
                Email = "guest1@test.com",
                DisplayName = "Guest 1"
            };

            var adminRole = new IdentityRole(Roles.Admin);
            var guestRole = new IdentityRole(Roles.Guest);

            await _role.CreateAsync(adminRole);
            await _role.CreateAsync(guestRole);

            await userManager.CreateAsync(admin, "P@ssw0rd");
            await userManager.AddToRolesAsync(admin, new[] { Roles.Admin });

            await userManager.CreateAsync(employee, "P@ssw0rd");
            await userManager.AddToRolesAsync(employee, new[] { Roles.Guest });

        }
    }
}
