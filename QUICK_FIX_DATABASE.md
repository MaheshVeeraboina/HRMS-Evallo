# Quick Fix: Create HRMS Database

## The Problem
```
Database `hrms` does not exist
```

## ✅ Easiest Solution: Use pgAdmin

1. **Open pgAdmin** (search for it in Windows Start menu)
2. **Connect to PostgreSQL server** (enter password: `123456`)
3. **Expand "Databases"** in the left panel
4. **Right-click "Databases"** → **Create** → **Database**
5. **Name:** `hrms`
6. **Click "Save"**

Done! ✅

## Alternative: Find and Use psql

### Step 1: Find PostgreSQL Installation

Look in these locations:
- `C:\Program Files\PostgreSQL\15\bin\psql.exe`
- `C:\Program Files\PostgreSQL\14\bin\psql.exe`
- `C:\Program Files\PostgreSQL\13\bin\psql.exe`
- `C:\Program Files (x86)\PostgreSQL\XX\bin\psql.exe`

### Step 2: Use Full Path

Open Command Prompt or PowerShell and run:

```cmd
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
```

(Replace `15` with your version number)

### Step 3: Enter Password and Create Database

When prompted:
- Password: `123456`
- Then run:
  ```sql
  CREATE DATABASE hrms;
  \q
  ```

## After Creating Database

1. **Run migrations** to create tables:
   ```bash
   cd backend
   npm run prisma:migrate
   ```

2. **Restart your server** (Ctrl+C then `npm run dev`)

3. **Test** - Try registering a user!

## That's It!

Once the database is created and migrations are run, everything should work! 🎉

