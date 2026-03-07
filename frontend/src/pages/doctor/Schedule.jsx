import React, { useState } from 'react'
import { Calendar, Save, CheckCircle, Clock } from 'lucide-react'
import { showSuccess } from '../../utils/toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedule() {
  const [schedule, setSchedule] = useState({
    Monday: { active: true, start: '09:00', end: '17:00' },
    Tuesday: { active: true, start: '09:00', end: '17:00' },
    Wednesday: { active: true, start: '09:00', end: '17:00' },
    Thursday: { active: true, start: '09:00', end: '17:00' },
    Friday: { active: true, start: '09:00', end: '17:00' },
    Saturday: { active: true, start: '09:00', end: '13:00' },
    Sunday: { active: false, start: '09:00', end: '17:00' },
  })

  const toggleDay = (day) => {
    setSchedule(p => ({ ...p, [day]: { ...p[day], active: !p[day].active } }))
  }

  const updateTime = (day, field, val) => {
    setSchedule(p => ({ ...p, [day]: { ...p[day], [field]: val } }))
  }

  const handleSave = () => {
    showSuccess('Schedule settings updated successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Schedule</h1>
          <p className="section-subtitle">Set your weekly availability for appointments</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 bg-teal-600 hover:bg-teal-700 shadow-md">
          <Save size={18} /> Update Timings
        </button>
      </div>

      <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-teal-50 flex items-center gap-3">
          <Calendar size={24} className="text-teal-600" />
          <h2 className="font-bold text-teal-900 text-lg">Weekly Availability</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {DAYS.map(day => {
            const { active, start, end } = schedule[day]
            return (
              <div key={day} className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${active ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="flex items-center gap-4 w-40">
                  {/* Custom Toggle Switch */}
                  <button type="button" onClick={() => toggleDay(day)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${active ? 'bg-teal-500' : 'bg-gray-300'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className={`font-bold ${active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{day}</span>
                </div>

                {active ? (
                  <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <div className="relative flex-1 md:flex-none md:w-32">
                      <Clock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                      <input type="time" value={start} onChange={e => updateTime(day, 'start', e.target.value)}
                        className="form-input pl-9 py-2 text-sm bg-gray-50 focus:bg-white" />
                    </div>
                    <span className="text-gray-400 font-bold px-2">-</span>
                    <div className="relative flex-1 md:flex-none md:w-32">
                      <Clock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                      <input type="time" value={end} onChange={e => updateTime(day, 'end', e.target.value)}
                        className="form-input pl-9 py-2 text-sm bg-gray-50 focus:bg-white" />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider px-4">Not Available</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
