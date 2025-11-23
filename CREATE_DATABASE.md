# Create the HRMS Database

## Current Error
```
Database `hrms` does not exist on the database server at `localhost:5432`.
```

## Solution: Create the Database

You have several options:

### Method 1: Using pgAdmin (Easiest)

1. **Open pgAdmin** (if installed)
2. **Connect to your PostgreSQL server** (localhost)
3. **Right-click on "Databases"** → **Create** → **Database**
4. **Name it:** `hrms`
5. **Click Save**

### Method 2: Using Command Line (if psql is in PATH)

```powershell
# Set password
$env:PGPASSWORD = "123456"

# Create database
psql -U postgres -c "CREATE DATABASE hrms;"
```

### Method 3: Add PostgreSQL to PATH, then use psql

1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\XX\bin`)
2. Add it to PATH:
   - Right-click "This PC" → Properties
   - Advanced System Settings → Environment Variables
   - Edit "Path" → Add PostgreSQL bin folder
3. Restart terminal
4. Run: `psql -U postgres -c "CREATE DATABASE hrms;"`

### Method 4: Use Full Path to psql

Find your PostgreSQL installation and use full path:

```powershell
# Example (adjust version number):
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE hrms;"
```

When prompted, enter password: `123456`

### Method 5: Let Prisma Create It (Recommended)

Prisma migrations can create the database automatically. Try this:

```bash
cd backend
npm run prisma:migrate
```

If it fails because database doesn't exist, use Method 1 or 2 first.

## After Creating Database

Once the database is created:

1. **Run Prisma migrations** to create tables:
   ```bash
   cd backend
   npm run prisma:migrate
   ```

2. **Restart your server** (if running)

3. **Test the connection** - try registering a user

## Verify Database Exists

After creating, verify it exists:

**Using pgAdmin:**
- Check the Databases list - you should see `hrms`

**Using Command Line:**
```powershell
psql -U postgres -l
# Look for "hrms" in the list
```

## Quick Checklist

- [ ] Database `hrms` created
- [ ] Run `npm run prisma:migrate`
- [ ] Restart server
- [ ] Test registration/login

