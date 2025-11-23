#!/bin/bash
# Run migrations and start the server
echo "Running database migrations..."
npx prisma migrate deploy
echo "Starting server..."
node server.js

