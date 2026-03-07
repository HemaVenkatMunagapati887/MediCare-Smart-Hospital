# Getting Started - MediCare+ Smart Hospital

Quick start guide for developers and users.

## For First-Time Users

### 1. Access the Application

**Frontend**: Navigate to `http://localhost:3000` (development) or your deployed URL

### 2. Create Account

1. Click "Register" on the homepage
2. Choose role: Patient, Doctor, or Admin
3. Fill in your details
4. Submit to create account

### 3. Login

1. Click "Login"
2. Enter email and password
3. Click "Sign In"

### 4. Patient Quick Start

After login:

1. Go to **Dashboard** - See appointment status and upcoming appointments
2. **Book Appointment** - Click "Book Appointment", select doctor, date, time
3. **View Appointments** - See all your appointments with status
4. **Symptom Checker** - Describe symptoms, get AI analysis
5. **Medical Records** - Upload and store medical reports
6. **Profile** - Update personal information and medical history

### 5. Doctor Quick Start

After login:

1. Go to **Dashboard** - See today's appointments and statistics
2. **Appointments** - View all patient appointments
3. **Schedule** - Set your availability and working hours
4. **Patient Details** - View patient information during consultation
5. **Diagnosis** - Create and store treatment records

### 6. Admin Quick Start

After login:

1. Go to **Dashboard** - Comprehensive system overview
2. **Manage Doctors** - Add, edit, remove doctor profiles
3. **Manage Patients** - Manage patient accounts
4. **Appointment Management** - Override/manage appointments
5. **Reports** - Generate system reports and analytics

---

## For Developers

### Prerequisites Check

```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version (should be 6+)
npm --version

# Check git
git --version
```

### 1. Clone Repository

```bash
git clone <repository-url>
cd MediCare-Smart-Hospital
```

### 2. Backend Setup (5 minutes)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
# Minimum required:
# - MONGODB_URI
# - JWT_SECRET
# - GROQ_API_KEY
# - CLOUDINARY_*
nano .env

# Start development server
npm run dev
```

**Verify Backend is Running**:

```bash
curl http://localhost:5000/api/health
# Should return: { status: "ok" }
```

### 3. Frontend Setup (5 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

**Verify Frontend is Running**:
Open `http://localhost:3000` in browser

### 4. First Login Credentials (Demo)

If you use the seeder script:

```bash
# Patient
Email: patient@test.com
Password: password123

# Doctor
Email: doctor@test.com
Password: password123

# Admin
Email: admin@test.com
Password: password123
```

---

## Common Development Tasks

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Viewing Logs

```bash
# Backend logs
cd backend
npm run dev  # Logs shown in console

# Frontend logs
cd frontend
npm run dev  # Logs shown in console
```

### Database Management

```bash
# Seed initial data
cd backend
npm run seed

# View database in MongoDB Atlas
# Dashboard → Clusters → Collections
```

### API Testing

**Using cURL**:

```bash
# Get all doctors
curl http://localhost:5000/api/v1/doctors

# Book appointment (requires token)
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctor":"...","date":"2024-03-15",...}'
```

**Using Postman**:

1. Import API collection from [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Set environment variables (token, API URL)
3. Execute requests

### Code Formatting

```bash
# Format code with Prettier
npm run format

# Check for linting issues
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## Troubleshooting

### Backend Won't Start

**Error**: `Port 5000 already in use`

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Restart backend
npm run dev
```

**Error**: `Cannot connect to MongoDB`

```bash
# Check connection string in .env
# Verify MongoDB Atlas cluster is running
# Check IP whitelist in MongoDB Atlas
# Test connection:
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(err => console.error(err))"
```

### Frontend Won't Load

**Error**: `localhost:3000 refuses connection`

```bash
# Check if frontend process is running
ps aux | grep vite

# Kill and restart
npm run dev
```

**Error**: `API connection failed`

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Verify VITE_API_URL in .env is correct
# Should be: http://localhost:5000/api/v1
```

### Appointment Won't Book

**Error**: `Time slot is already booked`

- The doctor already has an appointment at that time
- Try selecting a different time slot using "Get Available Slots"

**Error**: `You already have an appointment with this doctor`

- You have another appointment with same doctor on same date
- Reschedule existing appointment or choose a different date

### AI Features Not Working

**Error**: `AI service temporarily unavailable`

- Check Groq API key is valid
- Verify Groq API account has remaining quota
- System will use default fallback response
- Check backend logs for error details

---

## Environment Setup for Different OS

### macOS

```bash
# Install Node.js (using Homebrew)
brew install node

# Install MongoDB (using Homebrew)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community
```

### Windows

```bash
# Install Node.js
# Download from https://nodejs.org/
# Run installer

# Install MongoDB Community Edition
# Download from https://www.mongodb.com/try/download/community
# Run installer

# Start MongoDB Service
# Should start automatically after installation
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
curl https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

---

## Working with Git

### Create a Feature Branch

```bash
git checkout -b feature/appointment-notifications
```

### Commit Changes

```bash
git add .
git commit -m "feat: add appointment notifications"
```

### Push to Repository

```bash
git push origin feature/appointment-notifications
```

### Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Add description and click "Create Pull Request"

### Syncing with Main Branch

```bash
git fetch origin
git rebase origin/main
```

---

## Performance Tips

### For Development

- Use `npm run dev` not `npm start` (enables hot reload)
- Keep browser DevTools open to monitor network
- Use Chrome DevTools Lighthouse for performance audits

### For Production

- Run `npm run build` for optimized production builds
- Use CDN for static assets
- Enable gzip compression in server
- Implement caching strategies

---

## Next Steps

1. **Read** [README.md](README.md) for complete project overview
2. **Explore** [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. **Learn** [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
4. **Check** [CHANGELOG.md](CHANGELOG.md) for latest updates

---

## Support & Resources

- **Documentation**: See [README.md](README.md)
- **API Docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: GitHub Issues section
- **Discussions**: GitHub Discussions section

---

**Happy Coding! 🚀**

Time to complete setup: ~15 minutes
Time to first booking: ~20 minutes
