# راهنمای استقرار (Deployment)

این راهنما نحوه استقرار پروژه در محیط production را توضیح می‌دهد.

## Build برای Production

```bash
# نصب dependencies
npm install --production=false

# Build پروژه
npm run build

# ساختار خروجی:
dist/
├── server/       # Backend compiled files
└── web/         # Frontend static files
```

## متغیرهای محیط (Environment Variables)

فایل `.env` در production:

```bash
# Server
NODE_ENV=production
PORT=3002

# Database
DB_PATH=/path/to/production/database.db

# CORS
CORS_ORIGIN=https://your-domain.com

# Logging
LOG_LEVEL=error
```

## استقرار با PM2

### نصب PM2
```bash
npm install -g pm2
```

### ایجاد فایل ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'project-dashboard',
    script: './dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
  }]
};
```

### اجرای PM2
```bash
# شروع اپلیکیشن
pm2 start ecosystem.config.js

# مشاهده لیست processes
pm2 list

# مشاهده logs
pm2 logs

# ری‌استارت
pm2 restart project-dashboard

# متوقف کردن
pm2 stop project-dashboard

# حذف
pm2 delete project-dashboard

# ذخیره برای راه‌اندازی خودکار
pm2 save
pm2 startup
```

## استقرار با Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist ./dist
COPY project_dashboard.db* ./

# Expose port
EXPOSE 3002

# Start server
CMD ["node", "dist/server/index.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3002:3002"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - DB_PATH=/app/data/database.db
    restart: unless-stopped
```

### دستورات Docker
```bash
# Build image
docker build -t project-dashboard .

# Run container
docker run -d -p 3002:3002 --name dashboard project-dashboard

# با docker-compose
docker-compose up -d

# مشاهده logs
docker logs dashboard

# متوقف کردن
docker-compose down
```

## استقرار با Nginx

### تنظیمات Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/project/dist/web;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL با Let's Encrypt
```bash
# نصب certbot
sudo apt install certbot python3-certbot-nginx

# دریافت certificate
sudo certbot --nginx -d your-domain.com

# تمدید خودکار
sudo certbot renew --dry-run
```

## استقرار با Systemd

### ایجاد فایل service
```bash
sudo nano /etc/systemd/system/project-dashboard.service
```

```ini
[Unit]
Description=Project Dashboard
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/node /path/to/project/dist/server/index.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3002

[Install]
WantedBy=multi-user.target
```

### مدیریت service
```bash
# فعال‌سازی
sudo systemctl enable project-dashboard

# شروع
sudo systemctl start project-dashboard

# وضعیت
sudo systemctl status project-dashboard

# متوقف کردن
sudo systemctl stop project-dashboard

# ری‌استارت
sudo systemctl restart project-dashboard

# مشاهده logs
sudo journalctl -u project-dashboard -f
```

## پشتیبان‌گیری Database

### Script پشتیبان‌گیری
```bash
#!/bin/bash

DB_PATH="/path/to/project_dashboard.db"
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# ایجاد پوشه backup
mkdir -p $BACKUP_DIR

# کپی database
cp $DB_PATH "$BACKUP_DIR/database_$DATE.db"

# فشرده‌سازی
gzip "$BACKUP_DIR/database_$DATE.db"

# حذف backups قدیمی‌تر از 30 روز
find $BACKUP_DIR -name "database_*.gz" -mtime +30 -delete

echo "Backup completed: database_$DATE.db.gz"
```

### Cron job برای backup خودکار
```bash
# ویرایش crontab
crontab -e

# اضافه کردن backup روزانه در ساعت 2 بامداد
0 2 * * * /path/to/backup-script.sh
```

## Monitoring

### Health Check Endpoint
```bash
# بررسی سلامت سرور
curl http://localhost:3002/api/health
```

### Log Monitoring
```bash
# با PM2
pm2 logs --lines 100

# با systemd
journalctl -u project-dashboard -n 100 -f

# با Docker
docker logs -f dashboard --tail 100
```

## Performance Optimization

### Database
- استفاده از PRAGMA optimize قبل از بستن database
- Vacuum دوره‌ای برای فشرده‌سازی
- بررسی اندازه WAL files

### Frontend
- استفاده از CDN برای static assets
- فعال‌سازی gzip compression در Nginx
- استفاده از HTTP/2
- تنظیم cache headers مناسب

### Backend
- استفاده از clustering برای استفاده از تمام CPUs
- تنظیم connection pooling
- Rate limiting برای APIs

## Security Checklist

- [ ] متغیرهای محیط در .env تنظیم شده‌اند
- [ ] CORS برای دامنه مشخص تنظیم شده
- [ ] SSL/TLS فعال است
- [ ] Database file دسترسی مناسب دارد (chmod 600)
- [ ] Firewall فقط portهای لازم را باز کرده
- [ ] Updates منظم نصب می‌شوند
- [ ] Logs به صورت منظم بررسی می‌شوند
- [ ] Backup منظم انجام می‌شود

## Troubleshooting

### سرور start نمی‌شود
```bash
# بررسی port
netstat -tuln | grep 3002

# بررسی logs
pm2 logs
# یا
journalctl -u project-dashboard -n 50
```

### Database قفل است
```bash
# بستن connections باز
pm2 restart project-dashboard

# بررسی WAL files
ls -lh *.db*
```

### Memory usage بالاست
```bash
# بررسی memory
pm2 monit

# ری‌استارت برای آزاد کردن memory
pm2 restart project-dashboard
```

## Rollback

در صورت مشکل، rollback به نسخه قبلی:

```bash
# با git
git checkout <previous-version-tag>
npm run build
pm2 restart project-dashboard

# با backup
# restore database backup
cp /path/to/backup/database.db ./project_dashboard.db
pm2 restart project-dashboard
```

## Support

برای مشکلات deployment:
1. بررسی logs
2. بررسی environment variables
3. تست health endpoint
4. بررسی database access
5. مراجعه به documentation

## Updates

برای بروزرسانی:

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build
npm run build

# Restart
pm2 restart project-dashboard

# یا با systemd
sudo systemctl restart project-dashboard
```
