#!/bin/bash

# Exit on error
set -e

echo "Starting backend deployment..."

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y python3-pip python3-dev python3-venv libpq-dev postgresql postgresql-contrib nginx curl

# Create a system user for the application
echo "Creating system user..."
if ! id -u ocontest > /dev/null 2>&1; then
    sudo useradd --system --user-group --shell /bin/bash --home-dir /opt/ocontest ocontest
fi

# Create application directory
echo "Setting up application directory..."
sudo mkdir -p /opt/ocontest/backend
sudo chown -R ocontest:ocontest /opt/ocontest

# Set up Python virtual environment
echo "Setting up Python virtual environment..."
sudo -u ocontest python3 -m venv /opt/ocontest/venv
source /opt/ocontest/venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Set up database
echo "Setting up database..."
sudo -u postgres psql -c "CREATE USER ocontest_user WITH PASSWORD '${DB_PASSWORD}';" || echo "User already exists"
sudo -u postgres psql -c "CREATE DATABASE ocontest_prod OWNER ocontest_user;" || echo "Database already exists"
sudo -u postgres psql -d ocontest_prod -c "GRANT ALL PRIVILEGES ON DATABASE ocontest_prod TO ocontest_user;"

# Set up environment variables
echo "Setting up environment..."
sudo cp .env.production /opt/ocontest/backend/.env
sudo chown ocontest:ocontest /opt/ocontest/backend/.env
sudo chmod 600 /opt/ocontest/backend/.env

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --settings=ocontest.production_settings

# Run migrations
echo "Running migrations..."
python manage.py migrate --settings=ocontest.production_settings

# Set up Gunicorn
echo "Setting up Gunicorn..."
sudo cp deployment/gunicorn.service /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl restart gunicorn

# Set up Nginx
echo "Setting up Nginx..."
sudo cp deployment/nginx_backend /etc/nginx/sites-available/ocontest
sudo ln -sf /etc/nginx/sites-available/ocontest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt
echo "Setting up SSL..."
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ocontest.xyz -d www.ocontest.xyz --non-interactive --agree-tos -m admin@ocontest.xyz --redirect

# Set up SSL auto-renewal
echo "Setting up SSL auto-renewal..."
(sudo crontab -l 2>/dev/null; echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q") | sudo crontab -

echo "Backend deployment completed successfully!"
