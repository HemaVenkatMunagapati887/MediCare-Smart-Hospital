import React, { useState } from 'react'
import { Calendar, Clock, Video, User, Activity, AlertTriangle, UserRound, Filter, CheckCircle, XCircle } from 'lucide-react'

const allAppointments = [
  { id: 1, doc: 'Dr. Ravi Kumar', pat: 'Venkat R.', date: '12 Mar 2026', time: '10:30 AM', status: 'Upcoming', type: 'Consultation' },
  { id: 2, doc: 'Dr. Priya Sharma', pat: 'Rahul K.', date: '15 Mar 2026', time: '02:00 PM', status: 'Upcoming', type: 'Online Call' },
  { id: 3, doc: 'Dr. Arjun Mehta', pat: 'Anitha S.', date: '28 Feb 2026', time: '11:00 AM', status: 'Completed', type: 'Consultation' },
  { id: 4, doc: 'Dr. Sneha Patel', pat: 'Karthik M.', date: '15 Jan 2026', time: '04:30 PM', status: 'Completed', type: 'Follow-up' },
  { id: 5, doc: 'Dr. Karan Mehta', pat: 'Lakshmi V.', date: '10 Jan 2026', time: '09:00 AM', status: 'Cancelled', type: 'Consultation' },
]

export default function AppointmentManagement() {
  const [filter, setFilter] = useState('All')

  const filtered = allAppointments.filter(a => filter === 'All' || a.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">All Appointments</h1>
          <p className="section-subtitle">Monitor and manage hospital-wide appointments</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 bg-white">
          <Filter size={16} /> Filter by Date
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: 1250, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Upcoming', value: 45, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: 1180, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Cancelled', value: 25, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(s => (
          <div key={s.label} className="card p-4 border border-gray-100 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-xl w-fit border border-gray-100 shadow-sm">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card p-0 shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="py-4 px-6 border-r border-gray-100 w-1/4">Patient Details</th>
                <th className="py-4 px-6 border-r border-gray-100 w-1/4">Doctor Details</th>
                <th className="py-4 px-6 border-r border-gray-100 w-1/4">Appointment Info</th>
                <th className="py-4 px-6 w-1/4 text-center">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-violet-50/20 transition-colors group">
                  <td className="py-4 px-6 border-r border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 font-bold flex items-center justify-center shadow-inner">
                        {a.pat.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors block leading-tight">{a.pat}</span>
                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1"><UserRound size={10} /> Patient</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center shadow-inner">
                        {a.doc.charAt(4)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors block leading-tight">{a.doc}</span>
                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1"><Activity size={10} /> Doctor</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-gray-50 space-y-1">
                    <p className="text-sm text-gray-800 font-bold flex items-center gap-1.5"><Calendar size={14} className="text-violet-500" /> {a.date} <span className="text-gray-400 font-semibold mx-1">|</span> {a.time}</p>
                    <p className="text-xs text-blue-600 font-bold flex items-center gap-1.5 mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100">
                      {a.type === 'Online Call' ? <Video size={10} /> : <User size={10} />} {a.type}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${a.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {a.status}
                      </span>
                      {a.status === 'Upcoming' && (
                        <button className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">
                          <XCircle size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500 bg-gray-50/50">
                    <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="font-bold">No appointments found.</p>
                    <p className="text-sm mt-1 text-gray-400">Try changing the filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
