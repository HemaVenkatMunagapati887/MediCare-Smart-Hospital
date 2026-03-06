import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Star, ArrowRight, Clock, Video, CheckCircle, Activity, HeartPulse } from 'lucide-react'

export default function DoctorDashboard() {
  const stats = [
    { label: 'Today\'s Patients', value: 18, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Appointments', value: 24, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Rating', value: 4.8, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  const todayAppts = [
    { time: '10:30 AM', name: 'Venkat R.', type: 'Consultation', status: 'Waiting' },
    { time: '11:00 AM', name: 'Rahul K.', type: 'Follow-up', status: 'In Progress' },
    { time: '11:30 AM', name: 'Anitha S.', type: 'Online Call', status: 'Upcoming' },
  ]

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-teal-600 to-teal-800 text-white border-none shadow-lg py-8 px-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">Good Morning, Dr. Ravi! <HeartPulse size={28} className="text-teal-200" /></h1>
        <p className="text-teal-100 max-w-xl">You have 18 patients scheduled for today. Your next appointment is in 15 minutes.</p>
        <div className="flex gap-4 mt-6">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/30 text-white">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> On Duty
          </span>
          <Link to="/doctor/appointments" className="px-4 py-2 bg-white text-teal-700 font-bold rounded-xl shadow-sm text-sm hover:shadow-md transition-shadow">
            View Schedule
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.label} className="card p-6 flex flex-col gap-2 hover:shadow-md transition-shadow border-teal-100/50">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={26} className={s.color} />
              </div>
              {s.label === 'Avg Rating' && <span className="text-yellow-600 font-bold flex items-center gap-1 text-sm bg-yellow-50 px-2 py-1 rounded-lg">Top 5%</span>}
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-0 shadow-sm border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Clock size={18} className="text-teal-600" /> Today's Schedule</h2>
            <Link to="/doctor/appointments" className="text-sm font-semibold text-teal-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayAppts.map((a, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-500 w-16">{a.time}</span>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shadow-inner">
                    {a.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{a.name}</p>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><Activity size={12} /> {a.type}</p>
                  </div>
                </div>
                <div>
                  {a.status === 'Waiting' && <button className="px-4 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1">Start <ArrowRight size={12} /></button>}
                  {a.status === 'In Progress' && <span className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1.5 animate-pulse"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Ongoing</span>}
                  {a.status === 'Upcoming' && <span className="text-xs font-semibold text-gray-400">Upcoming</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 bg-gray-50 border border-gray-100 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-teal-600">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-4">Jump straight into patient diagnosis or manage your weekly schedule.</p>
          </div>
          <div className="w-full space-y-3 max-w-sm">
            <Link to="/doctor/diagnosis" className="w-full bg-white border border-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-xl shadow-sm hover:border-teal-400 hover:text-teal-700 transition-all flex items-center justify-between group">
              <span className="flex items-center gap-2"><Activity size={18} className="text-teal-500" /> Add Diagnosis</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/doctor/schedule" className="w-full bg-white border border-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-xl shadow-sm hover:border-teal-400 hover:text-teal-700 transition-all flex items-center justify-between group">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-teal-500" /> Edit My Schedule</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
