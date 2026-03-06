import React from 'react'
import { Link } from 'react-router-dom'

const monthlyData = [12, 18, 25, 22, 30, 28, 35, 42, 38, 45, 50, 48]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const recentAppointments = [
  { patient: 'Venkat Reddy', doctor: 'Dr. Ravi Kumar', date: '05 Mar', status: 'Booked' },
  { patient: 'Anjali Sharma', doctor: 'Dr. Priya Sharma', date: '05 Mar', status: 'In Progress' },
  { patient: 'Ramesh Kumar', doctor: 'Dr. Arjun Mehta', date: '04 Mar', status: 'Completed' },
  { patient: 'Priya Singh', doctor: 'Dr. Sneha Patel', date: '04 Mar', status: 'Cancelled' },
]

const statusBadge = (s) => {
  const map = { Booked: 'badge-booked', Completed: 'badge-completed', Cancelled: 'badge-cancelled', 'In Progress': 'bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full' }
  return <span className={map[s] || 'badge-pending'}>{s}</span>
}

const max = Math.max(...monthlyData)

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-300 text-sm">Admin Control Panel</p>
            <h1 className="text-2xl font-bold">Hospital Overview 📊</h1>
            <p className="text-violet-300 text-sm mt-1">March 2026 · All systems operational</p>
          </div>
          <div className="text-6xl hidden md:block">🏥</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '1,248', icon: '👥', change: '+12%', color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
          { label: 'Total Doctors', value: '48', icon: '👨‍⚕️', change: '+3', color: 'bg-teal-50 text-teal-600', border: 'border-teal-200' },
          { label: "Today's Appts", value: '127', icon: '📅', change: '+8%', color: 'bg-violet-50 text-violet-600', border: 'border-violet-200' },
          { label: 'Monthly Revenue', value: '₹4.2L', icon: '💰', change: '+15%', color: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
            <div className={`w-12 h-12 rounded-xl ${s.color} bg-opacity-20 flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">↑ {s.change} this month</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title text-lg">Appointments per Month</h2>
              <p className="section-subtitle">2025–2026 Overview</p>
            </div>
            <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg font-medium">Year 2025-26</span>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex justify-center">
                  <div className="absolute -top-6 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{v}</div>
                </div>
                <div
                  className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg hover:from-violet-700 hover:to-violet-500 transition-all cursor-pointer"
                  style={{ height: `${(v / max) * 100}%`, minHeight: '4px' }} title={`${months[i]}: ${v}`}
                />
                <p className="text-[10px] text-gray-400 mt-1">{months[i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4">Department Stats</h2>
          <div className="space-y-3">
            {[
              { dept: 'Cardiology', patients: 340, pct: 84 },
              { dept: 'Neurology', patients: 220, pct: 61 },
              { dept: 'Orthopedic', patients: 190, pct: 52 },
              { dept: 'Pediatrics', patients: 150, pct: 40 },
              { dept: 'General', patients: 348, pct: 95 },
            ].map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{d.dept}</span>
                  <span className="text-gray-400">{d.patients} patients</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
                    style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Appointments + Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card overflow-hidden p-0">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Recent Appointments</h2>
            <Link to="/admin/appointments" className="text-sm text-violet-600 hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>
                <th className="table-th">Patient</th><th className="table-th">Doctor</th>
                <th className="table-th">Date</th><th className="table-th">Status</th>
              </tr></thead>
              <tbody>
                {recentAppointments.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-td font-medium text-gray-900">{a.patient}</td>
                    <td className="table-td text-gray-500">{a.doctor}</td>
                    <td className="table-td text-gray-500">{a.date}</td>
                    <td className="table-td">{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4">Quick Admin Actions</h2>
          <div className="space-y-2">
            {[
              { icon: '👨‍⚕️', label: 'Add New Doctor', to: '/admin/doctors', color: 'bg-teal-50 text-teal-700' },
              { icon: '👥', label: 'Manage Patients', to: '/admin/patients', color: 'bg-blue-50 text-blue-700' },
              { icon: '🗓️', label: 'View Appointments', to: '/admin/appointments', color: 'bg-violet-50 text-violet-700' },
              { icon: '📊', label: 'View Reports', to: '/admin/reports', color: 'bg-orange-50 text-orange-700' },
            ].map(a => (
              <Link key={a.label} to={a.to}
                className={`flex items-center gap-3 p-3 rounded-xl ${a.color} font-medium text-sm hover:opacity-80 transition-all`}>
                <span className="text-xl">{a.icon}</span>{a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
