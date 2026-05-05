using Test.Application.Abstractions.Authentication;
using Test.Application.Bussiness.Auth.Dtos;

namespace Test.Application.Bussiness.Auth.Commands
{
    public class RefreshTokenCommandHandler(IJwtTokenService jwtTokenService) : ICommandHandler<RefreshTokenCommand, AuthResponseDto>
    {
        public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var result = await jwtTokenService.RefreshToken(request.RefreshToken, cancellationToken);
            return result;
        }
    }
}
