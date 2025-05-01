#!/bin/bash
echo "Running app_stop.sh"

# Stop all PM2 apps
pm2 stop all || true
