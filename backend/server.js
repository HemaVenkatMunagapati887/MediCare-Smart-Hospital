const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const visitRoutes = require('./routes/visitRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/visits', visitRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle port already in use
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n⚠️  Port ${PORT} is already in use. Attempting to free it...`);
    const { execSync } = require('child_process');
    const isWin = process.platform === 'win32';
    
    try {
      if (isWin) {
        // Find PID manually on Windows
        const output = execSync(`netstat -ano | findstr :${PORT}`).toString();
        const lines = output.split('\n');
        const listeningLine = lines.find(line => line.includes('LISTENING'));
        if (listeningLine) {
          const parts = listeningLine.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            console.log(`Found process ${pid} using port ${PORT}. Killing...`);
            execSync(`taskkill /F /PID ${pid}`);
          }
        }
      } else {
        execSync(`fuser -k ${PORT}/tcp`, { stdio: 'ignore' });
      }
      
      console.log(`✅ Port ${PORT} freed. Restarting...\n`);
      setTimeout(() => {
        server.listen(PORT);
      }, 1500);
    } catch (e) {
      console.error(`❌ Could not free port ${PORT}. Please manually kill the process.`);
      process.exit(1);
    }
  } else {
    throw err;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
