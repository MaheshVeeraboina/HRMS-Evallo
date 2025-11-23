# Reset PostgreSQL Password

If you've forgotten your PostgreSQL password, here are several ways to reset it:

## Method 1: Reset via pgAdmin (Easiest)

1. Open **pgAdmin** (if installed)
2. Connect to your PostgreSQL server
3. Right-click on the server → Properties
4. Go to the "Connection" tab
5. Change the password there

## Method 2: Reset via Command Line (Windows)

### Step 1: Stop PostgreSQL Service

```powershell
# Run PowerShell as Administrator
Stop-Service postgresql-x64-XX  # Replace XX with your version number
# Or find the service name:
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

### Step 2: Create a temporary password file

Create a file `C:\temp\pg_pass.txt` with:
```
postgres
```

### Step 3: Start PostgreSQL in single-user mode

```powershell
# Navigate to PostgreSQL bin directory (adjust path for your version)
cd "C:\Program Files\PostgreSQL\15\bin"

# Start in single-user mode (replace 15 with your version)
.\postgres.exe --single -D "C:\Program Files\PostgreSQL\15\data" postgres
```

Then in the prompt, type:
```sql
ALTER USER postgres WITH PASSWORD 'newpassword';
\q
```

### Step 4: Restart PostgreSQL service

```powershell
Start-Service postgresql-x64-XX
```

## Method 3: Edit pg_hba.conf (Most Common)

### Step 1: Find pg_hba.conf file

Common locations:
- `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`
- `C:\ProgramData\PostgreSQL\15\data\pg_hba.conf`

### Step 2: Edit pg_hba.conf

1. Open the file in a text editor (as Administrator)
2. Find the line that says:
   ```
   host    all             all             127.0.0.1/32            md5
   ```
3. Change `md5` to `trust`:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
4. Save the file

### Step 3: Restart PostgreSQL

```powershell
Restart-Service postgresql-x64-XX
```

### Step 4: Connect and reset password

```powershell
psql -U postgres
```

Then in psql:
```sql
ALTER USER postgres WITH PASSWORD 'newpassword';
\q
```

### Step 5: Revert pg_hba.conf

Change `trust` back to `md5` and restart PostgreSQL again.

## Method 4: Use Default/Common Passwords

Try these common default passwords:
- `postgres` (most common default)
- `admin`
- `password`
- `root`
- (empty/blank)

## Method 5: Check if password is stored

### Check Windows Credential Manager

1. Open **Control Panel** → **Credential Manager**
2. Look for PostgreSQL entries
3. Check stored passwords

### Check installation notes

If you installed PostgreSQL yourself, check:
- Installation notes
- Password manager
- Notes/documentation

## Quick Test: Try Common Passwords

You can quickly test if any of these work by updating your `.env` file:

```env
# Try these one by one:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrms?schema=public"
DATABASE_URL="postgresql://postgres:admin@localhost:5432/hrms?schema=public"
DATABASE_URL="postgresql://postgres:password@localhost:5432/hrms?schema=public"
```

## After Resetting Password

1. Update your `.env` file with the new password
2. Restart your server
3. Test the connection

## Need Help?

If none of these work, you may need to:
1. Reinstall PostgreSQL (last resort)
2. Contact your system administrator
3. Check if PostgreSQL was installed by another application

