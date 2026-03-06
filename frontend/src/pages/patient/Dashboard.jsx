import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, FileText, Bot, Clock, ArrowRight, ShieldCheck, HeartPulse, Activity } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function PatientDashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Upcoming Appts', value: 2, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Visits', value: 8, icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lab Reports', value: 12, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const upcoming = [
    { doctor: 'Dr. Ravi Kumar', spec: 'Cardiologist', date: 'Today, 10:30 AM', type: 'Consultation' },
    { doctor: 'Dr. Sneha Patel', spec: 'Pediatrician', date: '12 Mar, 02:00 PM', type: 'Follow-up' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none shadow-lg !p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Patient'}! 👋</h1>
        <p className="text-blue-100 mb-6 max-w-xl">Your health dashboard is ready. You have 2 upcoming appointments this week.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/patient/book" className="px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm">
            <Calendar size={16} /> Book Appointment
          </Link>
          <Link to="/patient/symptom-checker" className="px-5 py-2.5 bg-blue-700/50 hover:bg-blue-700/70 text-white font-medium rounded-xl border border-blue-500/30 transition-all flex items-center gap-2 text-sm backdrop-blur-sm">
            <Bot size={16} /> Check Symptoms AI
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Col - Appts & Visits */}
        <div className="md:col-span-3 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map(s => (
              <div key={s.label} className="card p-5 flex items-center gap-4 hover:border-blue-200 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg} ${s.color}`}>
                  <s.icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Appointments */}
          <div className="card p-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" /> Upcoming Appointments
              </h2>
              <Link to="/patient/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-5 space-y-4">
              {upcoming.map((a, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                      {a.doctor.charAt(4)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{a.doctor}</p>
                      <p className="text-xs text-gray-500 font-medium">{a.spec} · {a.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5 justify-end">
                        <Clock size={14} className="text-blue-500" /> {a.date}
                      </p>
                    </div>
                    <button className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Visits Table */}
          <div className="card p-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" /> Recent Visits
              </h2>
              <Link to="/patient/history" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-th py-3 px-5">Date</th>
                    <th className="table-th py-3 px-5">Doctor</th>
                    <th className="table-th py-3 px-5">Diagnosis</th>
                    <th className="table-th py-3 px-5">Prescription</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { date: '15 Feb 2026', doctor: 'Dr. Priya Sharma', diag: 'Migraine', rx: 'View Details' },
                    { date: '02 Jan 2026', doctor: 'Dr. Ravi Kumar', diag: 'Routine', rx: 'View Details' }
                  ].map((v, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="table-td py-3 px-5 text-gray-500 font-medium">{v.date}</td>
                      <td className="table-td py-3 px-5 font-semibold text-gray-900">{v.doctor}</td>
                      <td className="table-td py-3 px-5 text-gray-600">{v.diag}</td>
                      <td className="table-td py-3 px-5">
                        <Link to="/patient/history" className="text-blue-600 font-medium hover:underline text-xs">{v.rx}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col - Health Summary */}
        <div className="space-y-6">
          <div className="card p-0 overflow-hidden sticky top-6">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <HeartPulse size={18} className="text-red-500" /> Health Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Blood Group', value: 'B+', icon: Activity, color: 'text-red-500' },
                { label: 'Age', value: '28 years', icon: User, color: 'text-blue-500' },
                { label: 'Weight', value: '72 kg', icon: Activity, color: 'text-orange-500' },
                { label: 'Height', value: '175 cm', icon: Activity, color: 'text-emerald-500' },
                { label: 'Allergies', value: 'Penicillin', icon: ShieldCheck, color: 'text-yellow-600' },
                { label: 'Last Visit', value: '28 Feb 2026', icon: FileText, color: 'text-purple-500' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <item.icon size={14} className={item.color} />
                    {item.label}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <Link to="/patient/records" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                View Full Records →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
