# ⚠️ URGENT: Create .env File

## The Problem
Your server is failing because the `.env` file is missing. This file contains your database connection string and other configuration.

## Quick Fix (Choose One Method)

### Method 1: PowerShell One-Liner (FASTEST)

Open PowerShell in the `backend` folder and run:

```powershell
@"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**⚠️ IMPORTANT:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password!

### Method 2: Manual Creation

1. Navigate to the `backend` folder
2. Create a new file named `.env` (with the dot at the beginning)
3. Copy and paste this content:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

**⚠️ IMPORTANT:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password!

### Method 3: Use the Script

1. Edit `create-env-simple.ps1` and change the password on line 4
2. Run: `.\create-env-simple.ps1`

## After Creating .env File

1. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

2. **Run Database Migrations:**
   ```bash
   npm run prisma:migrate
   ```

3. **Restart Your Server:**
   - Stop the server (Ctrl+C)
   - Start again: `npm run dev`

## Verify It Worked

After creating the `.env` file and restarting, you should see:
- ✅ Server starts without errors
- ✅ No "DATABASE_URL not found" errors
- ✅ You can register/login successfully

## Still Having Issues?

1. Check that `.env` file is in the `backend` folder (not in the root)
2. Verify your PostgreSQL password is correct
3. Make sure PostgreSQL is running
4. Check that the database `hrms` exists

