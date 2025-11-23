# Simple script to create .env file
# Edit the password below, then run: .\create-env-simple.ps1

$password = "postgres"  # CHANGE THIS to your PostgreSQL password

$envContent = @"
DATABASE_URL="postgresql://postgres:$password@localhost:5432/hrms?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
"@

$envPath = Join-Path $PSScriptRoot ".env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline

Write-Host ".env file created at: $envPath" -ForegroundColor Green
Write-Host "Make sure to update the password if needed!" -ForegroundColor Yellow

