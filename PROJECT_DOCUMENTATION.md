# 🏥 MediCare+ Smart Hospital Management System

## Complete Technical Analysis & Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Folder & File Structure](#4-folder--file-structure)
5. [Core Components](#5-core-components)
6. [Application Flow](#6-application-flow)
7. [Key Features](#7-key-features)
8. [Security Analysis](#8-security-analysis)
9. [Code Quality](#9-code-quality)
10. [Performance & Scalability](#10-performance--scalability)
11. [Deployment](#11-deployment)
12. [Professional README](#12-professional-readme)
13. [Interview Explanation Guide](#13-interview-explanation-guide)

---

## 1. Project Overview

### Purpose

MediCare+ is a **full-stack AI-powered hospital management system** designed to streamline healthcare operations by connecting patients, doctors, and administrators through an intelligent digital platform.

### Problem Statement

Traditional hospital systems suffer from:

- Manual appointment scheduling inefficiencies
- High patient no-show rates (15-30% industry average)
- Lack of intelligent symptom triage
- Poor patient-doctor communication
- Fragmented medical records management

### Solution

MediCare+ addresses these with:

- **AI-powered symptom analysis** for pre-consultation triage
- **Smart appointment scheduling** with no-show prediction
- **Intelligent waitlist management** with auto-allocation
- **Medical report summarization** using LLM technology
- **Role-based access control** for secure multi-user access

---

## 2. Technology Stack

### Backend

| Technology | Version | Purpose             |
| ---------- | ------- | ------------------- |
| Node.js    | 20.x    | Runtime environment |
| Express.js | 5.2.1   | Web framework       |
| MongoDB    | Atlas   | Database            |
| Mongoose   | 9.2.4   | ODM                 |
| JWT        | 9.0.3   | Authentication      |
| Groq SDK   | 0.5.0   | AI/LLM integration  |
| Nodemailer | 8.0.1   | Email service       |
| Multer     | 1.4.5   | File uploads        |
| bcryptjs   | 3.0.3   | Password hashing    |

### Frontend

| Technology   | Version | Purpose            |
| ------------ | ------- | ------------------ |
| React        | 18.2.0  | UI framework       |
| Vite         | 5.4.21  | Build tool         |
| Tailwind CSS | 4.2.1   | Styling            |
| React Router | 6.14.1  | Routing            |
| Axios        | 1.4.0   | HTTP client        |
| Recharts     | 3.7.0   | Data visualization |
| Lucide React | 0.577.0 | Icons              |

### AI/ML

| Technology   | Model         | Purpose              |
| ------------ | ------------- | -------------------- |
| Groq         | LLaMA 3.3 70B | Medical AI assistant |
| Tesseract.js | 7.0.0         | OCR for reports      |

---

## 3. Architecture

### Pattern: **Layered MVC + Service-Oriented Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Patient   │  │   Doctor    │  │    Admin    │              │
│  │   Portal    │  │   Portal    │  │   Portal    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│              ┌───────────▼───────────┐                          │
│              │    React + Vite       │                          │
│              │  (Context + Services) │                          │
│              └───────────┬───────────┘                          │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────┼──────────────────────────────────────┐
│                          ▼                                       │
│              ┌───────────────────────┐                          │
│              │     API GATEWAY       │                          │
│              │   (Express Router)    │                          │
│              └───────────┬───────────┘                          │
│                          │                                       │
│     ┌────────────────────┼────────────────────┐                 │
│     ▼                    ▼                    ▼                  │
│ ┌────────┐         ┌──────────┐        ┌──────────┐            │
│ │ Auth   │         │ Protect  │        │ Authorize│            │
│ │Middleware│       │Middleware│        │Middleware│            │
│ └────┬───┘         └────┬─────┘        └────┬─────┘            │
│      └──────────────────┼───────────────────┘                   │
│                         ▼                                        │
│              ┌───────────────────────┐                          │
│              │     CONTROLLERS       │                          │
│              │  (Request Handlers)   │                          │
│              └───────────┬───────────┘                          │
│                          │                                       │
│     ┌────────────────────┼────────────────────┐                 │
│     ▼                    ▼                    ▼                  │
│ ┌────────────┐    ┌────────────┐     ┌────────────┐            │
│ │ AI Service │    │ Scheduling │     │Notification│            │
│ │  (Groq)    │    │  Service   │     │  Service   │            │
│ └────────────┘    └────────────┘     └────────────┘            │
│                          │                                       │
│              ┌───────────▼───────────┐                          │
│              │       MODELS          │                          │
│              │    (Mongoose ODM)     │                          │
│              └───────────┬───────────┘                          │
│                          │                                       │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  MongoDB    │
                    │   Atlas     │
                    └─────────────┘
```

### Data Flow

```
User Request → React Component → Service Layer → Axios API Call
                                                       │
                                                       ▼
Express Router → Middleware (Auth/RBAC) → Controller → Service → Model → MongoDB
                                                       │
                                                       ▼
                                              Response ← JSON
```

---

## 4. Folder & File Structure

```
MediCare-Smart-Hospital/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json           # Dependencies & scripts
│   ├── seeder.js              # Database seeding utility
│   ├── .env                   # Environment variables
│   │
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js            # User schema (authentication)
│   │   ├── Patient.js         # Patient profile & history
│   │   ├── Doctor.js          # Doctor profile & schedule
│   │   ├── Appointment.js     # Appointment with smart features
│   │   ├── Visit.js           # Medical records
│   │   ├── AdminDoctor.js     # Doctor whitelist
│   │   └── Waitlist.js        # Waitlist management
│   │
│   ├── controllers/
│   │   ├── authController.js       # Login, Register, OAuth
│   │   ├── patientController.js    # Patient CRUD
│   │   ├── doctorController.js     # Doctor CRUD
│   │   ├── appointmentController.js# Legacy appointments
│   │   ├── schedulingController.js # Smart scheduling
│   │   ├── aiController.js         # AI endpoints
│   │   └── visitController.js      # Medical records
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # /api/v1/auth/*
│   │   ├── patientRoutes.js        # /api/v1/patients/*
│   │   ├── doctorRoutes.js         # /api/v1/doctors/*
│   │   ├── appointmentRoutes.js    # /api/v1/appointments/*
│   │   ├── schedulingRoutes.js     # /api/v1/scheduling/*
│   │   ├── aiRoutes.js             # /api/v1/ai/*
│   │   └── visitRoutes.js          # /api/v1/visits/*
│   │
│   ├── services/
│   │   ├── aiService.js            # Groq LLM integration
│   │   ├── schedulingService.js    # Smart booking logic
│   │   ├── availabilityService.js  # Slot management
│   │   ├── noShowPredictionService.js # ML predictions
│   │   ├── waitlistService.js      # Queue management
│   │   └── notificationService.js  # Email notifications
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── roleMiddleware.js       # RBAC authorization
│   │
│   └── utils/
│       ├── generateToken.js        # JWT generation
│       ├── sendEmail.js            # Nodemailer transport
│       ├── emailTemplates.js       # HTML email templates
│       ├── slotGenerator.js        # Time slot utilities
│       └── reportParser.js         # PDF/DOCX/OCR parsing
│
└── frontend/
    ├── index.html             # Entry HTML
    ├── package.json           # Dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.cjs    # Tailwind setup
    │
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Root component + routing
        ├── index.css          # Global styles
        │
        ├── contexts/
        │   └── AuthContext.jsx     # Auth state management
        │
        ├── services/
        │   ├── api.js              # Axios instance
        │   ├── auth.js             # Auth API calls
        │   ├── ai.js               # AI API calls
        │   └── scheduling.js       # Scheduling API calls
        │
        ├── components/
        │   ├── Navbar.jsx          # Public navigation
        │   ├── Sidebar.jsx         # Dashboard navigation
        │   ├── ProtectedRoute.jsx  # Route guards
        │   └── FloatingChatbot.jsx # AI chat widget
        │
        ├── layouts/
        │   ├── PublicLayout.jsx    # Public pages
        │   ├── PatientLayout.jsx   # Patient dashboard
        │   ├── DoctorLayout.jsx    # Doctor dashboard
        │   └── AdminLayout.jsx     # Admin dashboard
        │
        └── pages/
            ├── public/             # Landing, Login, Register
            ├── patient/            # Patient portal pages
            ├── doctor/             # Doctor portal pages
            ├── admin/              # Admin portal pages
            └── ai/                 # AI feature pages
```

---

## 5. Core Components

### Backend Services

| Service                     | Responsibility                                        |
| --------------------------- | ----------------------------------------------------- |
| **aiService**               | Groq LLM integration for symptoms, reports, chat      |
| **schedulingService**       | Smart appointment booking, cancellation, rescheduling |
| **availabilityService**     | Slot generation, working hours, availability checking |
| **noShowPredictionService** | Heuristic-based no-show probability calculation       |
| **waitlistService**         | Priority queue management, auto-allocation            |
| **notificationService**     | Email notifications with professional templates       |

### Key Models

| Model           | Purpose                                           |
| --------------- | ------------------------------------------------- |
| **User**        | Authentication, roles (patient/doctor/admin)      |
| **Patient**     | Profile, attendance history, notification prefs   |
| **Doctor**      | Specialization, working hours, consultation types |
| **Appointment** | Full appointment lifecycle with smart features    |
| **Waitlist**    | Priority-based waiting queue                      |
| **Visit**       | Medical records and prescriptions                 |

### Frontend Components

| Component           | Purpose                                 |
| ------------------- | --------------------------------------- |
| **AuthContext**     | Global auth state, login/logout methods |
| **ProtectedRoute**  | RBAC route guards                       |
| **FloatingChatbot** | AI assistant widget                     |
| **Sidebar**         | Role-based dashboard navigation         |

---

## 6. Application Flow

### Appointment Booking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PATIENT BOOKING FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Patient selects doctor/date                                  │
│              │                                                   │
│              ▼                                                   │
│  2. Frontend calls GET /scheduling/slots/:doctorId               │
│              │                                                   │
│              ▼                                                   │
│  3. availabilityService.getAvailableSlots()                     │
│     - Checks working hours                                       │
│     - Filters booked slots                                       │
│     - Considers visit type duration                              │
│              │                                                   │
│              ▼                                                   │
│  4. Patient selects slot, submits booking                        │
│              │                                                   │
│              ▼                                                   │
│  5. POST /scheduling/book                                        │
│              │                                                   │
│              ▼                                                   │
│  6. schedulingController.bookAppointment()                       │
│     - Validates slot availability                                │
│     - Calculates no-show probability                             │
│     - Creates appointment record                                 │
│              │                                                   │
│              ▼                                                   │
│  7. notificationService.sendAppointmentConfirmation()            │
│              │                                                   │
│              ▼                                                   │
│  8. Response: { success: true, appointment }                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### AI Symptom Analysis Flow

```
User Input → detectEmergency() → If emergency → Return urgent response
                    │
                    ▼ If not emergency
            analyzeSymptoms()
                    │
                    ▼
            Groq LLM API Call
                    │
                    ▼
        Parse JSON Response
                    │
                    ▼
        Return: conditions, specialist, actions
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOWS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LOCAL REGISTRATION:                                             │
│  ──────────────────                                              │
│  1. User submits name, email, password, role                     │
│  2. Backend validates: password strength, email format, role     │
│  3. If doctor: validates email ends with @rguktn.ac.in           │
│     AND exists in AdminDoctor whitelist                          │
│  4. OTP sent to email for verification (10 min expiry)           │
│  5. User verifies OTP                                            │
│  6. Account created with hashed password                         │
│  7. Patient/Doctor profile record created                        │
│  8. JWT token returned                                           │
│                                                                  │
│  LOCAL LOGIN:                                                    │
│  ────────────                                                    │
│  1. User submits email, password                                 │
│  2. Backend finds user, verifies password with bcrypt            │
│  3. JWT token generated                                          │
│  4. Token stored in localStorage                                 │
│                                                                  │
│  GOOGLE OAUTH:                                                   │
│  ─────────────                                                   │
│  1. Frontend gets Google ID token                                │
│  2. Backend verifies token with Google                           │
│  3. If existing user: logs in                                    │
│  4. If new user: returns needs_registration flag                 │
│  5. User selects role and sets password                          │
│  6. Account created with google auth provider                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Key Features

### Patient Features

- ✅ AI-powered symptom checker with emergency detection
- ✅ Smart appointment booking with availability view
- ✅ Natural language booking ("Book me with a cardiologist next Monday")
- ✅ Waitlist registration with auto-notification
- ✅ Medical record upload and AI summarization
- ✅ Visit history tracking
- ✅ Profile management

### Doctor Features

- ✅ Daily schedule dashboard
- ✅ Patient appointment management
- ✅ No-show risk indicators
- ✅ Patient check-in system
- ✅ Medical record creation
- ✅ Working hours configuration
- ✅ Waitlist management

### Admin Features

- ✅ Doctor whitelist management
- ✅ Patient management
- ✅ All appointments overview
- ✅ System analytics and reports
- ✅ Bulk reminder sending

### AI Features

- ✅ Symptom analysis with condition probabilities
- ✅ Emergency symptom detection
- ✅ Medical report summarization (PDF/DOCX/Image)
- ✅ Doctor recommendation engine
- ✅ Health risk prediction
- ✅ Conversational medical assistant
- ✅ No-show probability prediction

---

## 8. Security Analysis

### Current Security Measures ✅

| Measure             | Implementation                                     |
| ------------------- | -------------------------------------------------- |
| Password Hashing    | bcrypt with salt rounds                            |
| JWT Authentication  | Token-based stateless auth                         |
| Role-Based Access   | Middleware authorization                           |
| Input Validation    | Express validators                                 |
| CORS Configuration  | Origin whitelist                                   |
| Password Strength   | Min 8 chars, uppercase, lowercase, number, special |
| OTP Expiry          | 10-minute expiration for verification              |
| Doctor Whitelisting | Email domain + admin approval                      |

### Vulnerabilities & Recommendations ⚠️

| Risk                       | Severity | Recommendation                              |
| -------------------------- | -------- | ------------------------------------------- |
| No rate limiting           | High     | Add `express-rate-limit` for API throttling |
| JWT in localStorage        | Medium   | Use httpOnly cookies for tokens             |
| No HTTPS enforcement       | High     | Force HTTPS in production                   |
| Missing CSRF protection    | Medium   | Add CSRF tokens for forms                   |
| No request sanitization    | Medium   | Add `express-mongo-sanitize`                |
| Sensitive data in logs     | Low      | Use structured logging, redact PII          |
| No API versioning strategy | Low      | Implement proper versioning headers         |

### Recommended Security Additions

```javascript
// Rate limiting
const rateLimit = require("express-rate-limit");
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Helmet for security headers
const helmet = require("helmet");
app.use(helmet());

// MongoDB sanitization
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

// XSS protection
const xss = require("xss-clean");
app.use(xss());
```

---

## 9. Code Quality

### Strengths ✅

- **Modular Architecture**: Clear separation of concerns
- **Consistent Naming**: camelCase for functions, PascalCase for models
- **Async/Await**: Modern asynchronous patterns throughout
- **Error Handling**: express-async-handler prevents uncaught exceptions
- **Service Layer**: Business logic abstracted from controllers
- **Reusable Components**: Frontend components are modular

### Areas for Improvement

| Area           | Suggestion                                    |
| -------------- | --------------------------------------------- |
| Testing        | Add Jest/Vitest unit tests, Supertest for API |
| Documentation  | Add JSDoc comments to functions               |
| Type Safety    | Consider TypeScript migration                 |
| Error Messages | Standardize error response format             |
| Logging        | Add Winston/Pino structured logging           |
| Validation     | Use Joi/Zod for schema validation             |

---

## 10. Performance & Scalability

### Current Optimizations ✅

- MongoDB indexing on frequently queried fields
- AI response caching (5-minute TTL)
- Async operations throughout

### Scalability Recommendations

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    ┌─────────┐     ┌─────────────────┐     ┌─────────┐         │
│    │   CDN   │────▶│  Load Balancer  │◀────│ SSL/TLS │         │
│    │(Static) │     │    (Nginx)      │     │ (Let's) │         │
│    └─────────┘     └────────┬────────┘     └─────────┘         │
│                             │                                    │
│              ┌──────────────┼──────────────┐                    │
│              ▼              ▼              ▼                    │
│         ┌────────┐    ┌────────┐    ┌────────┐                 │
│         │ Node 1 │    │ Node 2 │    │ Node 3 │                 │
│         │ :5000  │    │ :5001  │    │ :5002  │                 │
│         └────┬───┘    └────┬───┘    └────┬───┘                 │
│              │             │             │                      │
│              └──────┬──────┴──────┬──────┘                      │
│                     ▼             ▼                             │
│              ┌──────────┐  ┌──────────┐                        │
│              │  Redis   │  │ MongoDB  │                        │
│              │ (Cache)  │  │ (Replica)│                        │
│              └──────────┘  └──────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Performance Improvements

| Area     | Recommendation                        |
| -------- | ------------------------------------- |
| Caching  | Add Redis for session/API caching     |
| Database | Enable MongoDB replica set            |
| API      | Implement response compression (gzip) |
| Frontend | Add lazy loading for routes           |
| Images   | Use image optimization/CDN            |
| Queries  | Add pagination to all list endpoints  |

---

## 11. Deployment

### Environment Variables Required

```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=30d
GROQ_API_KEY=gsk_...
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=app-password
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com

# Frontend (.env)
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: ./backend/.env
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:80"

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Platform Deployment Options

| Platform         | Backend        | Frontend       | Database        |
| ---------------- | -------------- | -------------- | --------------- |
| **Vercel**       | ❌             | ✅ Recommended | MongoDB Atlas   |
| **Railway**      | ✅ Recommended | ✅             | ✅ Built-in     |
| **Render**       | ✅             | ✅             | MongoDB Atlas   |
| **AWS**          | EC2/ECS        | S3+CloudFront  | DocumentDB      |
| **DigitalOcean** | App Platform   | App Platform   | Managed MongoDB |

---

## 12. Professional README

```markdown
# 🏥 MediCare+ Smart Hospital Management System

A full-stack AI-powered hospital management system built with the MERN stack
and Groq LLM integration.

## ✨ Features

- 🤖 **AI Symptom Checker** - Intelligent symptom analysis with emergency detection
- 📅 **Smart Scheduling** - No-show prediction and intelligent slot management
- 📋 **Medical Report AI** - Automatic summarization of medical documents
- 👨‍⚕️ **Multi-Role Portals** - Patient, Doctor, and Admin dashboards
- 🔐 **Secure Auth** - JWT + Google OAuth with role-based access
- 📧 **Email Notifications** - Professional appointment confirmations and reminders

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Groq AI
**Frontend:** React 18, Vite, Tailwind CSS, React Router
**AI:** LLaMA 3.3 70B via Groq API

## 🚀 Quick Start

# Clone repository

git clone https://github.com/yourusername/medicare-smart-hospital.git

# Install dependencies

cd backend && npm install
cd ../frontend && npm install

# Configure environment

cp backend/.env.example backend/.env

# Edit .env with your credentials

# Run development servers

cd backend && npm run dev
cd frontend && npm run dev

## 📁 Project Structure

├── backend/ # Express.js API server
│ ├── models/ # Mongoose schemas
│ ├── controllers/ # Route handlers
│ ├── services/ # Business logic
│ └── routes/ # API endpoints
├── frontend/ # React application
│ ├── src/pages/ # Page components
│ ├── src/services/ # API clients
│ └── src/contexts/ # State management

## 🔑 API Endpoints

| Module       | Endpoints                |
| ------------ | ------------------------ |
| Auth         | `/api/v1/auth/*`         |
| Patients     | `/api/v1/patients/*`     |
| Doctors      | `/api/v1/doctors/*`      |
| Appointments | `/api/v1/appointments/*` |
| Scheduling   | `/api/v1/scheduling/*`   |
| AI           | `/api/v1/ai/*`           |

## 👥 User Roles

- **Patient**: Book appointments, check symptoms, view records
- **Doctor**: Manage schedule, view patients, create records
- **Admin**: Manage doctors, view reports, system settings

## 📄 License

MIT License
```

---

## 13. Interview Explanation Guide

### Opening Statement (30 seconds)

> "MediCare+ is a full-stack hospital management system I built using the MERN stack with AI integration. It solves three key problems in healthcare: inefficient appointment scheduling, lack of intelligent patient triage, and fragmented medical records management."

### Technical Highlights (2-3 minutes)

**1. AI Integration**

> "I integrated Groq's LLaMA 3.3 70B model for multiple AI features. The symptom analyzer performs emergency detection first using keyword matching, then sends non-emergency cases to the LLM for detailed analysis including possible conditions, urgency levels, and recommended specialists."

**2. Smart Scheduling Architecture**

> "The scheduling system uses a heuristic-based no-show prediction algorithm considering seven weighted factors: patient history (35%), distance from clinic (15%), appointment time (15%), day of week (10%), lead time (10%), visit type (10%), and weather (5%). High-risk appointments can be overbooked to maintain doctor utilization."

**3. Authentication Flow**

> "I implemented multi-provider authentication with local email/password using bcrypt hashing and Google OAuth. Doctor registration requires email domain validation plus admin whitelist verification to ensure only authorized medical professionals can create accounts."

**4. Role-Based Access Control**

> "The system uses JWT with middleware-based RBAC. Three roles exist: patient, doctor, and admin. Each route is protected by chained middleware that first verifies the JWT, then checks if the user's role is authorized for that endpoint."

### Architecture Discussion (1-2 minutes)

> "The architecture follows a layered MVC pattern with a dedicated service layer. Controllers handle HTTP concerns, services contain business logic, and models define data schemas. This separation allows easy testing and maintenance. The frontend uses React Context for global auth state and custom hooks for API integration."

### Challenges & Solutions

> "One challenge was handling concurrent appointment bookings. I solved this by implementing optimistic locking on the slot check and using MongoDB transactions for the booking operation to prevent race conditions."

### Scalability Discussion

> "For production, I'd add Redis for caching AI responses and session management, implement a message queue for email notifications, and set up MongoDB replica sets for high availability. The stateless JWT approach already allows horizontal scaling of the API servers."

### Closing Impact Statement

> "This project demonstrates full-stack development with AI integration, secure authentication patterns, and production-ready architecture. It showcases my ability to build complex systems that solve real-world healthcare challenges."

---

## Key Project Metrics

| Metric                     | Value |
| -------------------------- | ----- |
| MongoDB Models             | 7     |
| REST API Endpoints         | 60+   |
| Backend Services           | 6     |
| Frontend Pages             | 17    |
| User Roles                 | 3     |
| AI Functions               | 9     |
| No-Show Prediction Factors | 7     |

---

## API Reference

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint               | Access  | Description                          |
| ------ | ---------------------- | ------- | ------------------------------------ |
| POST   | `/register`            | Public  | Register with email/password         |
| POST   | `/register/send-otp`   | Public  | Send OTP for registration            |
| POST   | `/register/verify-otp` | Public  | Verify OTP and complete registration |
| POST   | `/login`               | Public  | Login with email/password            |
| POST   | `/google`              | Public  | Google OAuth login                   |
| POST   | `/google-register`     | Public  | Google OAuth registration with role  |
| POST   | `/forgot-password`     | Public  | Request password reset OTP           |
| POST   | `/verify-otp`          | Public  | Verify password reset OTP            |
| POST   | `/reset-password`      | Public  | Reset password                       |
| GET    | `/logout`              | Private | Logout user                          |
| GET    | `/me`                  | Private | Get current user profile             |

### Patient Routes (`/api/v1/patients`)

| Method | Endpoint | Access       | Description                   |
| ------ | -------- | ------------ | ----------------------------- |
| GET    | `/`      | Admin/Doctor | Get all patients              |
| POST   | `/`      | Private      | Create/Update patient profile |
| GET    | `/me`    | Private      | Get current patient profile   |
| GET    | `/:id`   | Private      | Get patient by ID             |

### Doctor Routes (`/api/v1/doctors`)

| Method | Endpoint | Access       | Description                |
| ------ | -------- | ------------ | -------------------------- |
| GET    | `/`      | Public       | Get all doctors            |
| POST   | `/`      | Admin        | Create doctor profile      |
| GET    | `/me`    | Doctor       | Get current doctor profile |
| GET    | `/:id`   | Public       | Get doctor by ID           |
| PUT    | `/:id`   | Doctor/Admin | Update doctor profile      |

### Scheduling Routes (`/api/v1/scheduling`)

| Method | Endpoint                     | Access               | Description                  |
| ------ | ---------------------------- | -------------------- | ---------------------------- |
| GET    | `/slots/:doctorId`           | Public               | Get available slots for date |
| GET    | `/slots/:doctorId/range`     | Public               | Get slots for date range     |
| GET    | `/suggestions/:doctorId`     | Public               | Get smart suggestions        |
| POST   | `/book`                      | Patient              | Smart appointment booking    |
| POST   | `/cancel/:appointmentId`     | Patient/Doctor/Admin | Cancel appointment           |
| POST   | `/reschedule/:appointmentId` | Patient/Doctor/Admin | Reschedule appointment       |
| POST   | `/waitlist/join`             | Patient              | Join waitlist                |
| GET    | `/waitlist/my`               | Patient              | Get my waitlist entries      |
| POST   | `/no-show/:appointmentId`    | Doctor/Admin         | Mark as no-show              |
| POST   | `/complete/:appointmentId`   | Doctor/Admin         | Complete appointment         |

### AI Routes (`/api/v1/ai`)

| Method | Endpoint                   | Access        | Description                  |
| ------ | -------------------------- | ------------- | ---------------------------- |
| POST   | `/symptoms/analyze`        | Optional Auth | AI symptom analysis          |
| POST   | `/symptoms/doctors`        | Optional Auth | Get doctors by symptoms      |
| POST   | `/report/summarize`        | Optional Auth | Summarize medical report     |
| POST   | `/doctor/recommend`        | Optional Auth | AI doctor recommendation     |
| POST   | `/health/risk`             | Optional Auth | Predict health risk          |
| POST   | `/emergency/detect`        | Public        | Detect emergency symptoms    |
| POST   | `/chat`                    | Optional Auth | AI medical assistant chat    |
| GET    | `/appointment/:id/summary` | Private       | Generate appointment summary |

---

## Database Schema Summary

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: ['patient', 'doctor', 'admin'],
  googleId: String (sparse),
  authProvider: ['local', 'google'],
  resetOtp: String,
  resetOtpExpire: Date
}
```

### Patient Model

```javascript
{
  user: ObjectId → User,
  phone: String,
  address: String,
  dateOfBirth: Date,
  weight: Number,
  height: Number,
  gender: ['Male', 'Female', 'Other'],
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  emergencyContact: String,
  attendanceHistory: {
    totalAppointments: Number,
    completedAppointments: Number,
    noShowAppointments: Number,
    averageNoShowRate: Number
  },
  notificationPreferences: {
    email: Boolean,
    sms: Boolean,
    reminderHoursBefore: Number
  }
}
```

### Doctor Model

```javascript
{
  user: ObjectId → User,
  specialization: String (required),
  experience: Number,
  fees: Number,
  about: String,
  image: String,
  availability: [String],
  ratings: Number,
  totalPatients: Number,
  workingHours: [{
    day: String,
    isWorking: Boolean,
    startTime: String,
    endTime: String,
    breakStart: String,
    breakEnd: String
  }],
  consultationTypes: [{
    name: String,
    duration: Number,
    description: String,
    fee: Number
  }],
  defaultSlotDuration: Number,
  maxOverbookingLimit: Number
}
```

### Appointment Model

```javascript
{
  patient: ObjectId → User,
  doctor: ObjectId → Doctor,
  date: Date,
  timeSlot: String,
  endTime: String,
  status: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
  reason: String,
  notes: String,
  visitType: ['First Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'],
  duration: Number,
  noShowProbability: Number,
  isOverbooking: Boolean,
  reminderSent: Boolean,
  checkedIn: Boolean,
  bookedVia: ['manual', 'waitlist', 'ai-suggestion']
}
```

---

## No-Show Prediction Algorithm

The system uses a weighted heuristic algorithm to predict appointment no-shows:

```
No-Show Score =
  (0.35 × Patient History Score) +
  (0.15 × Distance Score) +
  (0.15 × Time of Day Score) +
  (0.10 × Day of Week Score) +
  (0.10 × Lead Time Score) +
  (0.10 × Visit Type Score) +
  (0.05 × Weather Impact Score)
```

### Risk Thresholds

- **High Risk**: Score > 40%
- **Medium Risk**: Score 20-40%
- **Low Risk**: Score < 20%

### Actions Based on Risk

- High risk appointments may be overbooked
- Automated reminders prioritized for high-risk patients
- Doctors alerted to potential no-shows on daily schedule

---

_Generated on: March 7, 2026_
_Version: 1.0.0_
