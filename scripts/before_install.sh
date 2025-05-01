#!/bin/bash
echo "Running before_install.sh"

# Stop any existing app processes
pm2 stop all || true
pm2 delete all || true

# Clean previous deployment
rm -rf /home/ec2-user/codeshare
mkdir -p /home/ec2-user/codeshare
