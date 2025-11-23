# Script to create the hrms database
# Make sure PostgreSQL is running and password is correct

Write-Host "Creating database 'hrms'..." -ForegroundColor Cyan

# Set password (update if different)
$env:PGPASSWORD = "123456"

# Try to create database
$createDb = psql -U postgres -c "CREATE DATABASE hrms;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database 'hrms' created successfully!" -ForegroundColor Green
} else {
    if ($createDb -like "*already exists*") {
        Write-Host "✅ Database 'hrms' already exists!" -ForegroundColor Green
    } else {
        Write-Host "❌ Error creating database:" -ForegroundColor Red
        Write-Host $createDb -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual steps:" -ForegroundColor Yellow
        Write-Host "1. Open Command Prompt or PowerShell"
        Write-Host "2. Run: psql -U postgres"
        Write-Host "3. Enter password: 123456"
        Write-Host "4. Run: CREATE DATABASE hrms;"
        Write-Host "5. Run: \q"
    }
}

Write-Host ""
Write-Host "Next step: Run migrations" -ForegroundColor Cyan
Write-Host "  cd backend"
Write-Host "  npm run prisma:migrate"

