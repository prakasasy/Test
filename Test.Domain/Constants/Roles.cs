namespace Test.Domain.Constants
{
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Guest = "Guest";

        public static readonly IReadOnlyList<string> All = new[]
        {
            Admin,
            Guest
        };
    }
}
