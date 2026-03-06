import React, { useState } from 'react'
import { Calendar, Clock, Video, FileText, CheckCircle, XCircle, User } from 'lucide-react'

const allAppointments = [
  { id: 1, doctor: 'Dr. Ravi Kumar', spec: 'Cardiologist', date: 'Upcoming: 12 Mar 2026', time: '10:30 AM', status: 'Upcoming', type: 'Consultation' },
  { id: 2, doctor: 'Dr. Priya Sharma', spec: 'Neurologist', date: 'Upcoming: 15 Mar 2026', time: '02:00 PM', status: 'Upcoming', type: 'Online Call' },
  { id: 3, doctor: 'Dr. Arjun Mehta', spec: 'Orthopedic', date: '28 Feb 2026', time: '11:00 AM', status: 'Completed', type: 'Consultation' },
  { id: 4, doctor: 'Dr. Sneha Patel', spec: 'Pediatrician', date: '15 Jan 2026', time: '04:30 PM', status: 'Completed', type: 'Follow-up' },
  { id: 5, doctor: 'Dr. Karan Mehta', spec: 'Dermatologist', date: '10 Jan 2026', time: '09:00 AM', status: 'Cancelled', type: 'Consultation' },
]

export default function Appointments() {
  const [filter, setFilter] = useState('All')

  const filtered = allAppointments.filter(a => filter === 'All' || a.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Appointments</h1>
          <p className="section-subtitle">Manage your upcoming and past consultations</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-xl w-fit border border-gray-100 shadow-sm">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(app => (
          <div key={app.id} className="card p-5 border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                  {app.doctor.charAt(4)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{app.doctor}</h3>
                  <p className="text-xs font-semibold text-blue-600">{app.spec}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${app.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-red-100 text-red-700'
                }`}>
                {app.status}
              </span>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-400" /> <span className="font-medium">{app.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-gray-400" /> <span className="font-medium">{app.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {app.type === 'Online Call' ? <Video size={16} className="text-blue-500" /> : <User size={16} className="text-purple-500" />}
                <span className="font-medium">{app.type}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              {app.status === 'Upcoming' && (
                <>
                  <button className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm">
                    {app.type === 'Online Call' ? <><Video size={14} /> Join Call</> : <><CheckCircle size={14} /> Confirm</>}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                    <XCircle size={14} /> Cancel
                  </button>
                </>
              )}
              {app.status === 'Completed' && (
                <>
                  <button className="flex-1 btn-secondary py-2 text-xs flex items-center justify-center gap-1.5">
                    <FileText size={14} /> View Report
                  </button>
                  <button className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm">
                    <Calendar size={14} /> Rebook
                  </button>
                </>
              )}
              {app.status === 'Cancelled' && (
                <button className="w-full btn-primary py-2 text-xs shadow-sm">Re-schedule</button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No appointments found</h3>
            <p className="text-gray-500 text-sm mb-4">You have no {filter.toLowerCase()} appointments.</p>
            {filter !== 'All' && <button onClick={() => setFilter('All')} className="text-blue-600 font-semibold text-sm hover:underline">View All Appointments</button>}
          </div>
        )}
      </div>
    </div>
  )
}
