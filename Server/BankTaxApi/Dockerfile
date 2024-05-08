# Use an official .NET runtime as the base image
FROM mcr.microsoft.com/dotnet/sdk:6.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy the .csproj file(s) to the working directory
COPY *.csproj ./

# Restore the application dependencies
RUN dotnet restore

# Copy the rest of the application code to the working directory
COPY . .

# Build and publish the app
RUN dotnet publish -c Release -o out

# Set the ASPNETCORE_URLS environment variable
ENV ASPNETCORE_URLS=http://*:5001

# Expose port 5001 in the container
EXPOSE 5001

# Start the app
CMD ["dotnet", "out/BankTaxApi.dll"]