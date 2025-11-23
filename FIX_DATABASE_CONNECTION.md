# Fix: Can't Reach Database Server

## Current Error
```
Can't reach database server at `localhost:5432`
```

This means PostgreSQL is **not running** on your computer.

## Solution: Start PostgreSQL

### Step 1: Check if PostgreSQL is Installed

**Option A: Check Services**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for any service with "PostgreSQL" in the name

**Option B: Check Installation Folder**
- Look in `C:\Program Files\PostgreSQL\`
- Or `C:\Program Files (x86)\PostgreSQL\`

### Step 2: Start PostgreSQL Service

**Method 1: Using Services Window (Recommended)**
1. Open Services (`Win + R` → `services.msc`)
2. Find PostgreSQL service (might be named like `postgresql-x64-15-XX`)
3. Right-click → **Start**
4. If it's already running, try **Restart**

**Method 2: Using PowerShell (Run as Administrator)**
```powershell
# Find the service
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Start it (replace with actual name from above)
Start-Service postgresql-x64-15-XX
```

**Method 3: Using Command Prompt (Run as Administrator)**
```cmd
net start postgresql-x64-15-XX
```

### Step 3: Verify It's Running

After starting, check the service status:
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}
```

Status should be "Running"

### Step 4: Restart Your Node Server

Once PostgreSQL is running:
1. Go back to your terminal where the server is running
2. The server should automatically reconnect
3. If not, restart: `Ctrl+C` then `npm run dev`

## If PostgreSQL is NOT Installed

You need to install PostgreSQL first:

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer

2. **Install PostgreSQL:**
   - Run the installer
   - Remember the password you set during installation!
   - Default port is 5432 (keep it)
   - Install all components

3. **After Installation:**
   - Update your `.env` file with the password you set
   - Start the PostgreSQL service
   - Run migrations: `npm run prisma:migrate`

## Alternative: Use Docker (If You Have Docker)

If you have Docker installed, you can run PostgreSQL in a container:

```powershell
docker run --name postgres-hrms -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hrms -p 5432:5432 -d postgres
```

Then update your `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrms?schema=public"
```

## Quick Checklist

- [ ] PostgreSQL service is running
- [ ] Service status shows "Running"
- [ ] Port 5432 is not blocked by firewall
- [ ] Password in `.env` matches PostgreSQL password
- [ ] Database `hrms` exists (run `npm run prisma:migrate` if not)

## Still Having Issues?

1. Check Windows Firewall - allow PostgreSQL
2. Check if another application is using port 5432
3. Try restarting your computer
4. Reinstall PostgreSQL if needed

