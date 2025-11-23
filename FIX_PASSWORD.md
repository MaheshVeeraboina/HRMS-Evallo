# Fix: Authentication Failed - Wrong Password

## Current Error
```
Authentication failed against database server at `localhost`, 
the provided database credentials for `postgres` are not valid.
```

## What This Means
✅ PostgreSQL is running  
✅ .env file is being read  
❌ The password in `.env` is incorrect

## Solution: Update Password in .env File

### Step 1: Find Your PostgreSQL Password

**Option A: Check if you remember it**
- Did you set a password during PostgreSQL installation?
- Check your notes or password manager

**Option B: Reset the password** (See `RESET_POSTGRES_PASSWORD.md`)

**Option C: Try common passwords**
- `postgres` (default)
- `admin`
- `password`
- `root`
- (empty/blank)

### Step 2: Update .env File

1. Open `backend\.env` file
2. Find this line:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrms?schema=public"
   ```
3. Change `postgres:postgres` to `postgres:YOUR_ACTUAL_PASSWORD`
   ```
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/hrms?schema=public"
   ```
4. Save the file

### Step 3: Restart Your Server

1. Stop the server (Ctrl+C)
2. Start again: `npm run dev`

## Quick Test: Try Common Passwords

Edit `backend\.env` and try these one by one:

```env
# Try 1: Default password
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrms?schema=public"

# Try 2: Admin
DATABASE_URL="postgresql://postgres:admin@localhost:5432/hrms?schema=public"

# Try 3: Password
DATABASE_URL="postgresql://postgres:password@localhost:5432/hrms?schema=public"

# Try 4: Empty (no password)
DATABASE_URL="postgresql://postgres@localhost:5432/hrms?schema=public"
```

After each change, restart your server and see if it works.

## If You Need to Reset Password

See `RESET_POSTGRES_PASSWORD.md` for detailed instructions.

**Quick Reset Method:**
1. Edit `pg_hba.conf` (usually in `C:\Program Files\PostgreSQL\XX\data\`)
2. Change `md5` to `trust` for localhost
3. Restart PostgreSQL service
4. Connect: `psql -U postgres`
5. Run: `ALTER USER postgres WITH PASSWORD 'newpassword';`
6. Change `trust` back to `md5`
7. Restart PostgreSQL
8. Update `.env` with new password

## After Fixing Password

Once the password is correct:
1. ✅ Server should connect successfully
2. ✅ You can register/login
3. ✅ Run migrations: `npm run prisma:migrate` (if not done)

