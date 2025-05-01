#!/bin/bash
echo "Running app_start.sh"

cd /home/ec2-user/codeshare/server

# Ensure Node version and dependencies
source /home/ec2-user/.nvm/nvm.sh
nvm use 18

npm install --production

# Start backend with PM2
pm2 start app.js --name codeshare-backend

cd ../client

# Serve frontend using a static server (e.g., serve)
npm install -g serve
serve -s build -l 3000 &

# Save PM2 state
pm2 save
