# Deployment Guide - MediCare+ Smart Hospital

Complete guide for deploying MediCare+ to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates obtained
- [ ] CDN configured (optional)
- [ ] Backup strategy in place
- [ ] Monitoring/logging configured
- [ ] All tests passing
- [ ] Code reviewed and approved

## 1. Deploying Backend to Heroku

### Prerequisites

- Heroku CLI installed
- Heroku account
- Git repository

### Steps

1. **Login to Heroku**

```bash
heroku login
```

2. **Create Heroku App**

```bash
heroku create your-medicare-api
# Or link existing app
heroku apps:create --remote heroku
```

3. **Set Environment Variables**

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set JWT_SECRET=your_very_secure_random_key
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/medicare
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
heroku config:set GROQ_API_KEY=your_groq_key
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_cloudinary_key
heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_secret
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password
```

4. **Create Procfile** (if not exists)

```bash
# backend/Procfile
web: node server.js
```

5. **Deploy**

```bash
git push heroku main
# Or specific branch
git push heroku development:main
```

6. **Verify Deployment**

```bash
heroku open
curl https://your-medicare-api.herokuapp.com/api/health
```

7. **Monitor Logs**

```bash
heroku logs --tail
heroku logs --tail --source app
```

### Scaling (Optional)

```bash
# Scale dynos
heroku ps:scale web=2

# View dynos
heroku ps
```

## 2. Deploying Frontend to Vercel

### Prerequisites

- Vercel account
- Vercel CLI installed

### Steps

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Configure Environment Variables**
   Create `vercel.json` in frontend directory:

```json
{
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

4. **Deploy**

```bash
cd frontend
vercel --prod
```

5. **Set Environment Variables in Vercel Dashboard**

- Go to Project Settings → Environment Variables
- Add `VITE_API_URL` = `https://your-medicare-api.herokuapp.com/api/v1`

6. **Verify Deployment**

- Visit the generated URL
- Check health endpoint connectivity

### Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records accordingly

## 3. Deploying to AWS

### Backend on EC2

1. **Create EC2 Instance**

- Ubuntu 20.04 LTS
- t2.micro or higher
- Security group: Allow port 22 (SSH), 80, 443, 5000

2. **Setup Server**

```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

3. **Clone and Setup Application**

```bash
cd /var/www
sudo git clone your-repo.git medicare
sudo chown -R ubuntu:ubuntu medicare
cd medicare/backend
npm install
```

4. **Create .env File**

```bash
sudo nano .env
# Add all environment variables
```

5. **Start Application with PM2**

```bash
pm2 start server.js --name "medicare-api"
pm2 save
pm2 startup
```

6. **Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/default
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

7. **Enable SSL with Certbot**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

8. **Restart Nginx**

```bash
sudo systemctl restart nginx
```

### Frontend on S3 + CloudFront

1. **Build Frontend**

```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**

- Enable static website hosting
- Block all public access except for bucket policy

3. **Upload Files**

```bash
aws s3 sync dist/ s3://your-bucket-name/
```

4. **Create CloudFront Distribution**

- Select S3 bucket as origin
- Set default root object to `index.html`
- Enable compression
- Add custom domain if available

## 4. Database Backup & Recovery

### MongoDB Atlas Backup

1. **Enable Daily Backups**

- Go to Atlas Dashboard → Backup
- Enable Automatic Backups
- Set retention to 7 days minimum

2. **Manual Backup**

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/medicare"
```

3. **Restore from Backup**

```bash
mongorestore dump/
```

### Local MongoDB Backup

```bash
# Backup
mongodump --db medicare --out /backups/

# Restore
mongorestore --db medicare /backups/medicare/
```

## 5. Monitoring & Logging

### Setup Error Tracking (Sentry)

1. **Install Sentry**

```bash
npm install @sentry/node @sentry/tracing
```

2. **Configure in Backend**

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://key@sentry.io/project-id",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Setup Monitoring (PM2+)

```bash
# Install PM2 Plus
pm2 install pm2-auto-pull
pm2 plus
```

### Logging with Winston

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

## 6. Performance Optimization

### CDN Configuration

1. **Serve Static Assets via CDN**

```javascript
app.use(
  express.static("public", {
    maxAge: "1d",
    etag: false,
  }),
);
```

2. **CloudFront Headers**

- Cache-Control: max-age=31536000 (1 year)
- Compression: gzip, brotli

### Database Optimization

1. **Index Optimization**

```bash
db.appointments.createIndex({ doctor: 1, date: 1, status: 1 })
db.appointments.createIndex({ patient: 1, status: 1 })
```

2. **Query Analysis**

```bash
db.appointments.find({}).explain("executionStats")
```

## 7. Security Hardening

### Update Dependencies

```bash
npm audit
npm audit fix
npm update
```

### Enable HTTPS Only

```javascript
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

### Add Security Headers

```javascript
const helmet = require("helmet");
app.use(helmet());
```

### CORS Security

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
```

## 8. Running Health Checks

### Automated Health Monitoring

```bash
# Create health check script
curl https://your-medicare-api.herokuapp.com/api/health

# Use with cron job
*/5 * * * * curl https://your-medicare-api.herokuapp.com/api/health
```

## 9. Performance Testing

### Load Testing with Apache Bench

```bash
ab -n 1000 -c 100 https://your-domain.com/api/health
```

### Using Artillery

```bash
npm install -g artillery
artillery run load-test.yml
```

## 10. Rollback Procedure

### Heroku Rollback

```bash
# View releases
heroku releases

# Rollback to previous release
heroku releases:rollback
```

### Git Rollback

```bash
git revert HEAD
git push origin main
```

## Troubleshooting Deploy Issues

### Heroku Deploy Fails

```bash
# Check build logs
heroku logs --tail

# Clear build cache
heroku builds:cancel
```

### High Memory Usage

```bash
# Monitor memory
heroku dyno:type
# Scale to larger dyno if needed
heroku dyno:type web=standard-1x
```

### Database Connection Issues

```bash
# Verify MongoDB URI
echo $MONGODB_URI

# Test connection
mongosh "$MONGODB_URI"
```

---

**Deployment Checklist Complete!**

For support: Check logs, verify environment variables, and consult AWS/Heroku documentation.
