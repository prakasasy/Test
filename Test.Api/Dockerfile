# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Directory.Packages.props ./
COPY Test.Api/Test.Api.csproj Test.Api/
COPY Test.Application/Test.Application.csproj Test.Application/
COPY Test.Domain/Test.Domain.csproj Test.Domain/
COPY Test.Infrastructure/Test.Infrastructure.csproj Test.Infrastructure/

RUN dotnet restore Test.Api/Test.Api.csproj

COPY . .
RUN dotnet publish Test.Api/Test.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

RUN mkdir -p /app/data /app/Logs

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "Test.Api.dll"]
