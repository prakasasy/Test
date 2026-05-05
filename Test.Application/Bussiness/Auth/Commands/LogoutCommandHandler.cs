using Test.Application.Abstractions.Authentication;
using System;
using System.Collections.Generic;
using System.Text;

namespace Test.Application.Bussiness.Auth.Commands
{
    public class LogoutCommandHandler(IJwtTokenService jwtTokenService) : ICommandHandler<LogoutCommand>
    {
        public async Task<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            await jwtTokenService.RevokeToken(request.refreshToken, cancellationToken);
            return Unit.Value;
        }
    }
}
