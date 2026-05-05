using Test.Api.Contracts.Auth;
using Test.Api.Helpers;
using Test.Application.Bussiness.Auth.Commands;
using Test.Infrastructure.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Test.Api.Modules
{
    public class AuthAPI : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            var apiGroup = app.MapGroup("/api/auth")
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .WithTags("Account");

            apiGroup.MapPost("/login", Login)
                .WithName("Login")
                .Produces<AuthResponse>(StatusCodes.Status200OK)
                .WithSummary("Login")
                .WithDescription("Login");

            apiGroup.MapPost("/logout", Logout)
                .RequireAuthorization()
                .WithName("Logout")
                .Produces(StatusCodes.Status200OK)
                .WithSummary("Logout")
                .WithDescription("Logout");

            apiGroup.MapPost("/refresh-token", RefreshToken)
                .WithName("Refresh Token")
                .Produces(StatusCodes.Status200OK)
                .WithSummary("Refresh Token")
                .WithDescription("Refresh Token");

            apiGroup.MapGet("/me", Me)
                .RequireAuthorization()
                .WithName("Me")
                .Produces(StatusCodes.Status200OK)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .WithSummary("Get current user")
                .WithDescription("Get current user");

        }

        static async Task<IResult> Login(LoginRequest request, ISender sender, RefreshTokenCookieHelper cookieHelper, HttpContext httpContext)
        {
            var command = new LoginCommand(request.Email, request.Password);
            var result = await sender.Send(command);
            var response = result.Adapt<AuthResponse>();

            if (!string.IsNullOrEmpty(result.RefreshToken))
            {
                cookieHelper.SetRefreshTokenCookie(httpContext.Response, result.RefreshToken, result.RefreshTokenExpiry);
            }

            return Results.Ok(response);
        }

        static async Task<IResult> Logout(ISender sender, RefreshTokenCookieHelper cookieHelper, HttpContext httpContext, IOptions<JwtOption> jwtOption)
        {
            var refreshToken = httpContext.Request.Cookies[jwtOption.Value.RefreshCookieName];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                var command = new LogoutCommand(refreshToken);
                await sender.Send(command);
            }

            cookieHelper.DeleteRefreshTokenCookie(httpContext.Response);
            return Results.Ok();
        }

        static async Task<IResult> RefreshToken(ISender sender, RefreshTokenCookieHelper cookieHelper, HttpContext httpContext, IOptions<JwtOption> jwtOption)
        {
            var refreshToken = httpContext.Request.Cookies[jwtOption.Value.RefreshCookieName];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Results.NoContent();
            }

            var command = new RefreshTokenCommand(refreshToken);
            var result = await sender.Send(command);

            if (!string.IsNullOrEmpty(result.RefreshToken))
            {
                cookieHelper.SetRefreshTokenCookie(httpContext.Response, result.RefreshToken, result.RefreshTokenExpiry);
            }
            else
            {
                cookieHelper.DeleteRefreshTokenCookie(httpContext.Response);
                return Results.NoContent();
            }
            var response = result.Adapt<AuthResponse>();
            return Results.Ok(response);

        }

        static Task<IResult> Me(ClaimsPrincipal user)
        {
            if (user?.Identity?.IsAuthenticated != true)
                return Task.FromResult<IResult>(Results.Unauthorized());

            // preferred claim keys: JwtRegisteredClaimNames.Sub (sub) for user id, JwtRegisteredClaimNames.Email for email
            var userId = user.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)
                      ?? user.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? user.FindFirstValue("id");

            var email = user.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email)
                       ?? user.FindFirstValue(ClaimTypes.Email)
                       ?? user.FindFirstValue("email");

            var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var result = new
            {
                UserId = userId,
                Email = email,
                Roles = roles
            };

            return Task.FromResult<IResult>(Results.Ok(result));
        }

    }
}
