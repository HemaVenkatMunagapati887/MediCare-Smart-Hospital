import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import PublicLayout from './layouts/PublicLayout'
import PatientLayout from './layouts/PatientLayout'
import DoctorLayout from './layouts/DoctorLayout'
import AdminLayout from './layouts/AdminLayout'

// Public
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'
import Doctors from './pages/public/Doctors'
import About from './pages/public/About'

// Patient
import PatientDashboard from './pages/patient/Dashboard'
import BookAppointment from './pages/patient/BookAppointment'
import Appointments from './pages/patient/Appointments'
import VisitHistory from './pages/patient/VisitHistory'
import MedicalRecords from './pages/patient/MedicalRecords'
import Profile from './pages/patient/Profile'
import SymptomChecker from './pages/patient/SymptomChecker'

// Doctor
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorAppointments from './pages/doctor/Appointments'
import PatientDetails from './pages/doctor/PatientDetails'
import Diagnosis from './pages/doctor/Diagnosis'
import Schedule from './pages/doctor/Schedule'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManagePatients from './pages/admin/ManagePatients'
import AppointmentManagement from './pages/admin/AppointmentManagement'
import Reports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'

// AI
import Chatbot from './pages/ai/Chatbot'
import ReportSummary from './pages/ai/ReportSummary'

import ProtectedRoute from './components/ProtectedRoute'
import FloatingChatbot from './components/FloatingChatbot'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* AI Routes (No Global Footer) */}
        <Route path="/ai/report-summary" element={<ReportSummary />} />

        {/* Patient Routes */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }>
          <Route index element={<PatientDashboard />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="history" element={<VisitHistory />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="profile" element={<Profile />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<PatientDetails />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingChatbot />
    </AuthProvider>
  )
}
