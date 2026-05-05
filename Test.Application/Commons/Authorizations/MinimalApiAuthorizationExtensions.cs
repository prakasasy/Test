using Microsoft.AspNetCore.Builder;

namespace Test.Application.Commons.Authorizations
{
    public static class MinimalApiAuthorizationExtensions
    {
        public static TBuilder RequireRoles<TBuilder>(
            this TBuilder builder,
            params string[] roles)
            where TBuilder : IEndpointConventionBuilder
        {
            return builder.RequireAuthorization(policy => policy.RequireRole(roles));
        }

    }
}
