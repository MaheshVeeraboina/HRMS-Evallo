# Troubleshooting Guide

## Internal Server Error

If you're getting an "Internal Server Error", follow these steps:

### 1. Check Database Connection

**Verify your `.env` file exists and has correct values:**

```bash
cd backend
# Check if .env exists
dir .env  # Windows
ls -la .env  # Linux/Mac
```

**Verify DATABASE_URL format:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hrms?schema=public"
```

**Test database connection:**
```bash
# Using psql
psql -U postgres -d hrms -c "SELECT 1;"
```

### 2. Check if Database Exists

```bash
# List all databases
psql -U postgres -l

# If hrms doesn't exist, create it
createdb -U postgres hrms
```

### 3. Run Prisma Migrations

**Generate Prisma Client:**
```bash
cd backend
npm run prisma:generate
```

**Run migrations to create tables:**
```bash
npm run prisma:migrate
```

**If migrations fail, check:**
- Database is running
- DATABASE_URL is correct
- You have permissions to create tables

### 4. Check Prisma Client Generation

```bash
cd backend
npm run prisma:generate
```

**Verify Prisma Client exists:**
```bash
# Check if node_modules/.prisma/client exists
dir node_modules\.prisma\client  # Windows
ls -la node_modules/.prisma/client  # Linux/Mac
```

### 5. Check Server Logs

Look at your terminal/console where the server is running. The error message should show:
- Database connection errors
- Missing table errors
- Prisma client errors

**Common error messages:**

**"Environment variable not found: DATABASE_URL"**
- Solution: Create `.env` file with DATABASE_URL

**"Can't reach database server"**
- Solution: Check if PostgreSQL is running
- Windows: Check Services, look for "postgresql"
- Linux/Mac: `sudo systemctl status postgresql`

**"Table does not exist"**
- Solution: Run `npm run prisma:migrate`

**"PrismaClientInitializationError"**
- Solution: 
  1. Check DATABASE_URL in .env
  2. Run `npm run prisma:generate`
  3. Run `npm run prisma:migrate`

### 6. Reset Database (Last Resort)

**⚠️ WARNING: This will delete all data!**

```bash
cd backend

# Drop and recreate database
psql -U postgres -c "DROP DATABASE hrms;"
psql -U postgres -c "CREATE DATABASE hrms;"

# Run migrations
npm run prisma:migrate
```

### 7. Check Node.js and npm Versions

```bash
node --version  # Should be v18 or higher
npm --version
```

### 8. Reinstall Dependencies

If nothing else works:

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
npm run prisma:migrate
```

## Quick Diagnostic Commands

Run these commands in order:

```bash
# 1. Check if .env exists
cd backend
dir .env  # or ls -la .env

# 2. Check database connection
psql -U postgres -d hrms -c "SELECT 1;"

# 3. Check if tables exist
psql -U postgres -d hrms -c "\dt"

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate

# 6. Start server
npm run dev
```

## Still Having Issues?

1. **Check the terminal output** - The error message will tell you exactly what's wrong
2. **Check PostgreSQL is running** - The database service must be active
3. **Verify credentials** - Username and password in DATABASE_URL must be correct
4. **Check port** - Default PostgreSQL port is 5432

## Common Solutions Summary

| Error | Solution |
|-------|----------|
| DATABASE_URL not found | Create `.env` file |
| Can't reach database | Start PostgreSQL service |
| Table doesn't exist | Run `npm run prisma:migrate` |
| Prisma client error | Run `npm run prisma:generate` |
| Connection refused | Check PostgreSQL is running and port is correct |

