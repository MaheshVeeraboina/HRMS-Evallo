# PowerShell script to create .env file
# Run this from the backend directory: .\create-env.ps1

$envContent = @"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
"@

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host ".env file already exists at: $envPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
}

# Get PostgreSQL password from user
$password = Read-Host "Enter your PostgreSQL password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# Replace YOUR_PASSWORD in the template
$envContent = $envContent -replace "YOUR_PASSWORD", $passwordPlain

# Write to file
$envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline

Write-Host "`.env file created successfully at: $envPath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify the DATABASE_URL in .env matches your PostgreSQL setup"
Write-Host "2. Run: npm run prisma:generate"
Write-Host "3. Run: npm run prisma:migrate"
Write-Host "4. Restart your server: npm run dev"

