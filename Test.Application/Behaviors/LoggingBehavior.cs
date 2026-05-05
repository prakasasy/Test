using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Test.Application.Behaviors
{
	public class LoggingBehavior<TRequest, TResponse>(
		ILogger<LoggingBehavior<TRequest, TResponse>> logger,
		IHttpContextAccessor httpContextAccessor
	) : IPipelineBehavior<TRequest, TResponse>
		where TRequest : notnull, IRequest<TResponse>
		where TResponse : notnull
	{
		public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
		{
			var requestName = typeof(TRequest).Name;
			var responseName = typeof(TResponse).Name;

			var httpContext = httpContextAccessor.HttpContext;
			var requestId = httpContext?.TraceIdentifier ?? "n/a";
			var userName = httpContext?.User?.Identity?.IsAuthenticated == true ? httpContext?.User?.Identity?.Name : "anonymous";

			using var scope = logger.BeginScope(new Dictionary<string, object?>
			{
				["RequestId"] = requestId,
				["UserName"] = userName,
				["RequestType"] = requestName
			});

			logger.LogInformation("Start handling {Request} -> {Response} {@RequestData}", requestName, responseName, request);

			var sw = Stopwatch.StartNew();
			try
			{
				var response = await next();
				sw.Stop();

				var elapsedMs = sw.ElapsedMilliseconds;
				if (elapsedMs > 3000)
				{
					logger.LogWarning("Long running request {Request} took {ElapsedMs}ms", requestName, elapsedMs);
				}

				logger.LogInformation("Handled {Request} in {ElapsedMs}ms returning {Response}", requestName, elapsedMs, responseName);
				return response;
			}
			catch (Exception ex)
			{
				sw.Stop();
				logger.LogError(ex, "Exception handling {Request} after {ElapsedMs}ms", requestName, sw.ElapsedMilliseconds);
				throw;
			}
		}
	}
}