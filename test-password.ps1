# Script to test common PostgreSQL passwords
# Run this from the backend directory

Write-Host "Testing common PostgreSQL passwords..." -ForegroundColor Cyan
Write-Host ""

$passwords = @("postgres", "admin", "password", "root", "")

foreach ($pwd in $passwords) {
    Write-Host "Testing password: '$pwd'" -ForegroundColor Yellow
    
    if ($pwd -eq "") {
        $connectionString = "postgresql://postgres@localhost:5432/hrms?schema=public"
    } else {
        $connectionString = "postgresql://postgres:$pwd@localhost:5432/hrms?schema=public"
    }
    
    # Test connection using psql
    $env:PGPASSWORD = $pwd
    $result = psql -U postgres -d hrms -c "SELECT 1;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SUCCESS! Password is: '$pwd'" -ForegroundColor Green
        Write-Host ""
        Write-Host "Update your .env file with:" -ForegroundColor Cyan
        Write-Host "DATABASE_URL=`"$connectionString`"" -ForegroundColor White
        break
    } else {
        Write-Host "❌ Failed" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "If none worked, you'll need to reset the password." -ForegroundColor Yellow
Write-Host "See RESET_POSTGRES_PASSWORD.md for instructions." -ForegroundColor Yellow

