import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, FileText, Bot, Clock, ArrowRight, ShieldCheck, HeartPulse, Activity } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Fetch appointments for this specific patient
        const apptRes = await api.get(`/appointments/patient/${user._id || user.id}`)
        setAppointments(apptRes.data.data || [])
        
        // Fetch medical visits/records
        const visitsRes = await api.get('/visits')
        setVisits(visitsRes.data.data || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user?._id || user?.id) {
      fetchDashboardData()
    }
  }, [user])

  const stats = [
    { label: 'Upcoming Appts', value: appointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Visits', value: visits.length, icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lab Reports', value: 0, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none shadow-lg !p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Patient'}! 👋</h1>
        <p className="text-blue-100 mb-6 max-w-xl">
          Your health dashboard is ready. You have {appointments.length} upcoming appointments.
        </p>
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
              {appointments.length > 0 ? (
                appointments.map((a, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                        {a.doctor?.user?.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Dr. {a.doctor?.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 font-medium">{a.doctor?.specialization || 'General'} · {a.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5 justify-end">
                          <Clock size={14} className="text-blue-500" /> {new Date(a.date).toLocaleDateString()} at {a.timeSlot}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        a.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming appointments scheduled.</p>
                  <Link to="/patient/book" className="text-blue-600 font-bold text-sm mt-2 inline-block">Book your first appointment</Link>
                </div>
              )}
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
                    <th className="table-th py-3 px-5 text-xs font-bold text-gray-400 uppercase">Date</th>
                    <th className="table-th py-3 px-5 text-xs font-bold text-gray-400 uppercase">Doctor</th>
                    <th className="table-th py-3 px-5 text-xs font-bold text-gray-400 uppercase">Title</th>
                    <th className="table-th py-3 px-5 text-xs font-bold text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {visits.length > 0 ? (
                    visits.map((v, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="table-td py-3 px-5 text-gray-500 font-medium">{new Date(v.createdAt).toLocaleDateString()}</td>
                        <td className="table-td py-3 px-5 font-semibold text-gray-900">Dr. {v.doctor?.name || 'Staff'}</td>
                        <td className="table-td py-3 px-5 text-gray-600">{v.title}</td>
                        <td className="table-td py-3 px-5">
                          <Link to="/patient/history" className="text-blue-600 font-bold hover:underline text-xs">View Report</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">No visit history found.</td>
                    </tr>
                  )}
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
                { label: 'Role', value: user?.role, icon: ShieldCheck, color: 'text-blue-600' },
                { label: 'Email', value: user?.email, icon: Mail, color: 'text-blue-500' },
                { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: Clock, color: 'text-emerald-500' },
              ].map(item => (
                item.value && (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <item.icon size={14} className={item.color} />
                      {item.label}
                    </div>
                    <span className="font-bold text-gray-900 text-sm truncate max-w-[120px]">{item.value}</span>
                  </div>
                )
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <Link to="/patient/profile" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Complete Health Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add simple Mail icon for the info card
function Mail({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

