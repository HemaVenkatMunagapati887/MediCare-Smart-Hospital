const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Doctor = require('./models/Doctor');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    // 1. Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    console.log('Data Destroyed...');

    // 2. Import Users
    const createdUsers = await User.create(users);
    console.log('Users Imported...');

    // 3. Import Doctors (Find the user IDs created above)
    const doctorUsers = createdUsers.filter(u => u.role === 'doctor');
    
    const doctors = [
      {
        user: doctorUsers[0]._id,
        specialization: 'Pediatrician',
        experience: 10,
        fees: 500,
        about: 'Dr. Sneha is a highly experienced pediatrician specializing in baby care and nutrition.',
        availability: ['Monday', 'Tuesday', 'Wednesday'],
        ratings: 4.7,
        totalPatients: 150
      },
      {
        user: doctorUsers[1]._id,
        specialization: 'Cardiologist',
        experience: 9,
        fees: 700,
        about: 'Dr. Suresh is an expert cardiologist with specialization in interventional cardiology.',
        availability: ['Thursday', 'Friday', 'Saturday'],
        ratings: 4.8,
        totalPatients: 200
      }
    ];

    await Doctor.create(doctors);
    console.log('Doctor Profiles Created...');

    console.log('Data Imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
