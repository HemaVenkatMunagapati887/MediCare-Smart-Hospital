# MediCare+ Smart Hospital Management System

A comprehensive, production-ready hospital management system built with modern web technologies. This system streamlines patient appointments, medical records management, doctor-patient interactions, and AI-powered health insights.

## 🌟 Features

### Patient Features

- **Smart Appointment Booking**: AI-powered appointment recommendations with doctor matching
- **Medical Records**: Digital storage and management of prescriptions, reports, and medical history
- **Symptom Checker**: AI-powered symptom analysis with condition predictions
- **Doctor Finder**: Search and filter doctors by specialization, rating, and availability
- **Visit History**: Track all past appointments and consultations
- **Appointment Management**: Reschedule, cancel, or view upcoming appointments

### Doctor Features

- **Dashboard**: Complete appointment overview and patient statistics
- **Patient Management**: View and manage patient records and history
- **Schedule Management**: Add availability slots and manage working hours
- **Digital Diagnosis**: Create and store diagnosis reports
- **Patient Details**: Access patient medical history during consultations

### Admin Features

- **Doctor Management**: Add, edit, and manage doctor profiles
- **Patient Management**: Oversee patient registrations and accounts
- **Appointment Oversight**: Manage all system appointments
- **Analytics & Reports**: Hospital statistics, revenue reports, and performance metrics
- **System Settings**: Configure hospital details, operating hours, and system parameters

### AI Features

- **Symptom Analysis**: Intelligent symptom classification and severity assessment
- **Medical Report Summarization**: Automatic extraction and summary of medical data
- **Doctor Recommendation**: Smart doctor matching based on patient needs
- **Health Risk Prediction**: Predict potential health issues and prevention strategies
- **Medical Chatbot**: 24/7 AI assistant for health queries
- **Load Balancing**: Automatic doctor recommendation based on workload

## 🏗️ Architecture

### Tech Stack

**Backend**

- Node.js with Express.js Framework
- MongoDB with Mongoose ODM
- JWT for Authentication
- Groq LLaMA 3.3 70B LLM for AI
- Cloudinary for File Storage
- Nodemailer for Email Notifications

**Frontend**

- React 18 with Vite
- React Router for Navigation
- Tailwind CSS for Styling
- Axios for API Communication
- Code Splitting & Lazy Loading

**Security & Performance**

- Helmet for Security Headers
- Express Rate Limiting
- CORS Configuration
- bcryptjs for Password Hashing
- JWT Token Validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Groq API Key (for AI features)
- Cloudinary Account (for file uploads)
- SMTP Server credentials (Gmail or SendGrid)

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd MediCare-Smart-Hospital
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
```

### 3. Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI (Groq)
GROQ_API_KEY=your_groq_api_key_here

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Database Setup

```bash
# Seed initial data (optional)
npm run seed
```

### 5. Run Backend

```bash
# Development
npm run dev

# Production
npm start

# Check health
curl http://localhost:5000/api/health
```

### 6. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 7. Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 8. Run Frontend

```bash
# Development with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📚 API Documentation

### Authentication Endpoints

**Register User**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role": "patient"
}
```

**Login**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}

Response: { token, user: { id, name, email, role } }
```

### Appointment Endpoints

**Book Appointment**

```http
POST /api/v1/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctor": "doctor_id",
  "date": "2024-03-15",
  "timeSlot": "10:00",
  "duration": 30,
  "reason": "Regular checkup",
  "visitType": "First Consultation"
}

Response: Success with appointment details
```

**Get Available Slots**

```http
GET /api/v1/appointments/doctor/:doctorId/available-slots?date=2024-03-15
Authorization: Bearer <token>

Response: { availableSlots: ["09:00", "09:30", ...] }
```

**Reschedule Appointment**

```http
PUT /api/v1/appointments/:id/reschedule
Authorization: Bearer <token>

{
  "date": "2024-03-20",
  "timeSlot": "14:00"
}
```

**Update Appointment Status**

```http
PUT /api/v1/appointments/:id
Authorization: Bearer <token>

{
  "status": "confirmed",
  "cancellationReason": "Doctor unavailable" // Required if status is 'cancelled'
}

Valid statuses: pending, confirmed, in-progress, completed, cancelled, no-show
```

### AI Endpoints

**Analyze Symptoms**

```http
POST /api/v1/ai/symptoms
Authorization: Bearer <token>
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "fatigue"],
  "patientHistory": {
    "age": 30,
    "gender": "male",
    "existingConditions": []
  }
}

Response: Conditions, urgency level, specialist recommendation
```

**Summarize Medical Report**

```http
POST /api/v1/ai/report-summary
Authorization: Bearer <token>

{
  "reportText": "Blood test results...",
  "reportType": "general"
}

Response: Summary, key findings, abnormal values, recommendations
```

**Chat with Medical Assistant**

```http
POST /api/v1/ai/chat
Authorization: Bearer <token>

{
  "message": "How can I lower my cholesterol?",
  "conversationHistory": []
}

Response: AI reply with suggested actions
```

### Doctor Endpoints

**Get All Doctors**

```http
GET /api/v1/doctors?specialization=Cardiology&rating=4
Authorization: Bearer <token>

Response: List of doctors with filters applied
```

**Get Doctor Profile**

```http
GET /api/v1/doctors/:id
Authorization: Bearer <token>

Response: Doctor details, specialization, availability, ratings
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with expiry validation
- **Role-Based Access Control**: Patient, Doctor, and Admin roles with role-specific endpoints
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Configuration**: Whitelisted frontend URL only
- **Helmet.js**: Security headers protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Request body validation and sanitization
- **File Upload Security**: Cloudinary storage with file type validation

## 🗄️ Database Schema

### User Model

- Basic auth, profile, role-based access

### Doctor Model

- Specialization, experience, availability slots, ratings

### Patient Model

- Medical history, allergies, past appointments

### Appointment Model

- Patient-Doctor mapping, scheduling, status tracking, rescheduling history

### Visit Model

- Consultation records, diagnosis, prescriptions

## 🚀 Deployment

### Heroku Deployment

```bash
# Create Heroku app
heroku create your-app-name

# Add environmental variables
heroku config:set GROQ_API_KEY=xxx
heroku config:set MONGODB_URI=xxx

# Deploy
git push heroku main
```

### Vercel Deployment (Frontend)

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of routes with React.lazy()
- **Image Optimization**: Cloudinary automatic image optimization
- **Caching**: 5-minute API response caching for AI analysis
- **Database Indexing**: Optimized queries with compound indexes
- **Minification**: Automatic via Vite build process

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Development Guidelines

### Code Structure

```
backend/
  ├── config/          # Database & external service configuration
  ├── controllers/     # Request handlers
  ├── middleware/      # Auth, validation, error handling
  ├── models/         # Mongoose schemas
  ├── routes/         # API endpoints
  ├── services/       # Business logic & external APIs
  ├── utils/          # Helper functions
  └── server.js       # Express app initialization

frontend/
  ├── components/     # Reusable React components
  ├── contexts/       # React Context for state management
  ├── layouts/        # Page layout wrappers
  ├── pages/          # Page components
  ├── services/       # API communication layer
  └── App.jsx         # Main app component
```

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error

```bash
# Verify connection string
# Check IP whitelist in MongoDB Atlas
# Ensure database exists
```

### Groq API Rate Limit

- Fallback responses are automatically used
- Check Groq Dashboard for usage statistics

### Cloudinary Upload Size Error

- Maximum file size: 10MB for reports, 5MB for profiles
- Check file size before upload

## 📞 Support

For issues and questions:

1. Check GitHub Issues
2. Review API Documentation
3. Check server logs: `tail -f logs/server.log`

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Development Team
- Medical Advisory Team

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready
