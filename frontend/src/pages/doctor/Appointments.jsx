import React, { useState } from 'react'
import { Calendar, Clock, Video, User, CheckCircle, XCircle } from 'lucide-react'

const allAppointments = [
  { id: 1, time: '10:30 AM', name: 'Venkat R.', type: 'Consultation', status: 'Upcoming', video: false },
  { id: 2, time: '11:00 AM', name: 'Rahul K.', type: 'Follow-up', status: 'Upcoming', video: false },
  { id: 3, time: '11:30 AM', name: 'Anitha S.', type: 'Consultation', status: 'Upcoming', video: true },
  { id: 4, time: '12:00 PM', name: 'Karthik M.', type: 'Review', status: 'Completed', video: false },
  { id: 5, time: '02:00 PM', name: 'Lakshmi V.', type: 'Consultation', status: 'Cancelled', video: true },
]

export default function DoctorAppointments() {
  const [filter, setFilter] = useState('All')

  const filtered = allAppointments.filter(a => filter === 'All' || a.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Appointments</h1>
          <p className="section-subtitle">Manage today's schedule and upcoming patients</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-xl w-fit border border-gray-100 shadow-sm">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-teal-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(app => (
          <div key={app.id} className="card p-5 border border-gray-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                  {app.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{app.name}</h3>
                  <p className="text-xs font-semibold text-teal-600">{app.type}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${app.status === 'Upcoming' ? 'bg-teal-100 text-teal-700' :
                  app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {app.status}
              </span>
            </div>

            <div className="space-y-2 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-800 font-bold">
                <Clock size={16} className="text-teal-500" /> <span>Today, {app.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                {app.video ? <Video size={16} className="text-blue-500" /> : <User size={16} className="text-purple-500" />}
                <span>{app.video ? 'Online Video Call' : 'In-Person Visit'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              {app.status === 'Upcoming' && (
                <>
                  <button className="flex-1 btn-primary py-2 text-xs flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white gap-1.5 shadow-sm">
                    {app.video ? <><Video size={14} /> Join</> : <><CheckCircle size={14} /> Start</>}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                    <XCircle size={14} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
