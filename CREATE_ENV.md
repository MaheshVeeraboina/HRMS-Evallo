# How to Create .env File

## Quick Steps

1. Navigate to the `backend` folder
2. Create a new file named `.env` (with the dot at the beginning)
3. Copy and paste the following content:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/hrms?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

## Important: Update Database Credentials

**Replace these values:**
- `YOUR_USERNAME` - Your PostgreSQL username (usually `postgres`)
- `YOUR_PASSWORD` - Your PostgreSQL password

## Example

If your PostgreSQL username is `postgres` and password is `mypassword123`, your DATABASE_URL should be:

```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/hrms?schema=public"
```

## Windows PowerShell Method

If you're using PowerShell, you can create the file with:

```powershell
cd backend
@"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**Don't forget to replace `YOUR_PASSWORD` with your actual PostgreSQL password!**

## After Creating .env

1. Restart your backend server (stop with Ctrl+C and run `npm run dev` again)
2. The error should be resolved!

