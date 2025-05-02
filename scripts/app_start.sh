#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

APP_DIR="/var/www/codeshare03"

# Navigate to the application directory where code was deployed
cd $APP_DIR

echo "Starting Node application from $APP_DIR..."

# Create .env file from AWS Parameter Store values
echo "Fetching environment variables from AWS Parameter Store..."

# Use parameter names EXACTLY as they appear in Parameter Store
MONGO_URI_PARAM="/codeshare-app/prod/mongodb-uri"
# GMAIL_USER_PARAM="/mern-todo-app/gmail-username"
# GMAIL_PASS_PARAM="/mern-todo-app/gmail-password"
# JWT_SECRET_PARAM="/mern-todo-app/jwt-secret"
ACCESS_KEY_PARAM='/codeshare-app/prod/AWS_ACCESS_KEY'
SECRET_ACCESS_KEY_PARAM='/codeshare-app/prod/secret_acess_key'
PORT_PARAM="/codeshare-app/port"
OPENROUTER_API_KEY_PARAM='/codeshare-app/prod/OPENROUTER_API_KEY'
# Fetch parameters - with error handling
echo "Fetching MongoDB URI..."
MONGO_URL=$(aws ssm get-parameter --name "$MONGO_URI_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch MongoDB URI parameter"; exit 1; }

echo "Fetching Gmail credentials..."
# GMAIL_USERNAME=$(aws ssm get-parameter --name "$GMAIL_USER_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch Gmail username parameter"; exit 1; }
# GMAIL_PASSWORD=$(aws ssm get-parameter --name "$GMAIL_PASS_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch Gmail password parameter"; exit 1; }
ACCESS_KEY=$(aws ssm get-parameter --name "$ACCESS_KEY_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch  AWS access key parameter"; exit 1; }
SECRET_ACCESS_KEY=$(aws ssm get-parameter --name "$SECRET_ACCESS_KEY_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch  AWS secret access key parameter"; exit 1; }
OPENROUTER_API_KEY=$(aws ssm get-parameter --name "$OPENROUTER_API_KEY_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch  open router key parameter"; exit 1;}
# echo "Fetching JWT secret..."
# JWT_SECRET=$(aws ssm get-parameter --name "$JWT_SECRET_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch JWT secret parameter"; exit 1; }

echo "Fetching port setting..."
PORT=$(aws ssm get-parameter --name "$PORT_PARAM" --query Parameter.Value --output text) || { echo "Failed to fetch port parameter"; exit 1; }

# Write to .env file
echo "Writing .env file..."
cat > "$APP_DIR/.env" << EOF
MONGO_URL=${MONGO_URL}
ACESS_KEY=${ACCESS_KEY}
SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
PORT=${PORT}
EOF

echo "Starting application with PM2..."

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please ensure Node.js is installed."
    exit 1
fi

# Start the application with PM2 using global path
pm2 start "$APP_DIR/server.js" --name "codeshare03" --env production

# Ensure PM2 restarts on server reboot
pm2 startup | bash || echo "PM2 startup script failed, you may need to configure it manually"
pm2 save || echo "PM2 save command failed"

echo "Application started successfully."