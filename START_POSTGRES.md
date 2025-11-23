# Start PostgreSQL Server

The error "Can't reach database server at `localhost:5432`" means PostgreSQL is not running.

## Quick Fix: Start PostgreSQL Service

### Method 1: Using Services (Easiest)

1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find PostgreSQL service (name might be `postgresql-x64-XX` or similar)
4. Right-click → **Start**

### Method 2: Using PowerShell (Run as Administrator)

```powershell
# Find PostgreSQL service
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Start the service (replace with actual service name)
Start-Service postgresql-x64-15-XX

# Or start all PostgreSQL services
Get-Service | Where-Object {$_.Name -like "*postgres*"} | Start-Service
```

### Method 3: Using Command Prompt (Run as Administrator)

```cmd
net start postgresql-x64-15-XX
```

(Replace `postgresql-x64-15-XX` with your actual service name)

## Verify PostgreSQL is Running

After starting, verify it's running:

```powershell
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

Status should show "Running"

## Test Connection

Once started, your server should automatically connect. If you still get errors:

1. Make sure the service is running
2. Check if port 5432 is available
3. Verify your password in `.env` file

## Common Service Names

- `postgresql-x64-15`
- `postgresql-x64-14`
- `postgresql-x64-13`
- `postgresql-x64-16`
- `PostgreSQL`

## If Service Doesn't Exist

If you don't see a PostgreSQL service, PostgreSQL might not be installed. You'll need to:

1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Or use Docker to run PostgreSQL in a container

## Auto-Start PostgreSQL (Optional)

To make PostgreSQL start automatically with Windows:

1. Open Services (`services.msc`)
2. Find PostgreSQL service
3. Right-click → Properties
4. Set "Startup type" to "Automatic"
5. Click OK

