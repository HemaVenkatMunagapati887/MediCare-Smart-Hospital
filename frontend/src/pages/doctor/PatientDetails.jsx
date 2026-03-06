import React, { useState } from 'react'
import { Calendar, Clock, Video, FileText, Activity, Users, CheckCircle, Phone, Mail, MapPin } from 'lucide-react'

// Dummy patient database for doctor
const patients = [
  {
    id: 1, name: 'Venkat R.', age: 28, gender: 'Male', bloodGroup: 'B+', phone: '+91 98765 43210', email: 'venkat@gmail.com', address: 'Hyderabad, TG', visits: [
      { date: '15 Feb 2026', diag: 'Routine Checkup', rx: 'Vitamin D3' },
      { date: '10 Jan 2026', diag: 'Mild Hypertension', rx: 'Rest, track BP' }
    ]
  },
  {
    id: 2, name: 'Rahul K.', age: 34, gender: 'Male', bloodGroup: 'O+', phone: '+91 88888 77777', email: 'rahul@gmail.com', address: 'Secunderabad, TG', visits: [
      { date: '05 Mar 2026', diag: 'Chest Pain', rx: 'ECG done, normal. Suggested antacids.' }
    ]
  },
  { id: 3, name: 'Anitha S.', age: 42, gender: 'Female', bloodGroup: 'A-', phone: '+91 77777 66666', email: 'anitha@gmail.com', address: 'Cyberabad, TG', visits: [] },
]

export default function PatientDetails() {
  const [selected, setSelected] = useState(patients[0])

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)] animate-fadeIn">
      {/* Left sidebar - Patient List */}
      <div className="md:w-80 flex-shrink-0 card p-0 flex flex-col border border-gray-100 shadow-sm overflow-hidden bg-white h-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50/80 z-10 sticky top-0">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><Users size={16} className="text-teal-600" /> My Patients</h2>
          <div className="relative">
            <input type="text" placeholder="Search patients..." className="w-full text-sm pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 shadow-inner" />
            <Activity size={14} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
          {patients.map(p => (
            <div key={p.id} onClick={() => setSelected(p)}
              className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${selected.id === p.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selected.id === p.id ? 'bg-teal-200 text-teal-800' : 'bg-gray-100 text-gray-600'}`}>
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${selected.id === p.id ? 'text-teal-900' : 'text-gray-900'}`}>{p.name}</p>
                <p className="text-xs text-gray-500 truncate">{p.age} yrs · {p.gender}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right pane - Details */}
      {selected ? (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar pb-10">
          {/* Profile Card */}
          <div className="card p-6 border-t-4 border-t-teal-500 shadow-sm relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-teal-100 text-teal-700 font-extrabold text-4xl flex items-center justify-center shadow-inner border-2 border-white">
                {selected.name.charAt(0)}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{selected.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-1.5"><Calendar size={14} className="text-teal-500" /> {selected.age} Years</span>
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-1.5"><Activity size={14} className="text-teal-500" /> {selected.gender}</span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg flex items-center gap-1"><HeartPulse size={12} /> {selected.bloodGroup}</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <button className="btn-primary py-2 px-5 text-sm flex items-center gap-2"><FileText size={16} /> View Full History</button>
                  <button className="btn-secondary py-2 px-5 text-sm flex items-center gap-2"><Activity size={16} /> Start Diagnosis</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-5 mt-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Phone size={14} className="text-gray-500" /></div>
                <div className="text-xs"><p className="text-gray-400 font-bold uppercase tracking-wider">Phone</p><p className="font-medium text-gray-900">{selected.phone}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Mail size={14} className="text-gray-500" /></div>
                <div className="text-xs"><p className="text-gray-400 font-bold uppercase tracking-wider">Email</p><p className="font-medium text-gray-900">{selected.email}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><MapPin size={14} className="text-gray-500" /></div>
                <div className="text-xs"><p className="text-gray-400 font-bold uppercase tracking-wider">Address</p><p className="font-medium text-gray-900 truncate">{selected.address}</p></div>
              </div>
            </div>
          </div>

          {/* Visits History */}
          <div className="card shadow-sm border border-gray-100 p-0 overflow-hidden shrink-0">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Clock size={16} className="text-teal-600" /> Past Consultations</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {selected.visits.length > 0 ? selected.visits.map((v, i) => (
                <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><Calendar size={14} className="text-teal-600" /> {v.date}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                      <p className="text-xs font-bold uppercase text-gray-400 mb-1 flex items-center gap-1"><Activity size={12} /> Diagnosis</p>
                      <p className="text-sm font-medium text-gray-800">{v.diag}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                      <p className="text-xs font-bold uppercase text-gray-400 mb-1 flex items-center gap-1"><FileText size={12} /> Prescription</p>
                      <p className="text-sm font-medium text-gray-800">{v.rx}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-500">
                  <CheckCircle size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold">No past visits recorded.</p>
                  <p className="text-sm mt-1">This is a new patient.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 card flex flex-col items-center justify-center text-gray-400 border border-gray-200 border-dashed bg-gray-50/50">
          <Users size={48} className="mb-4 opacity-50 text-teal-200" />
          <p className="font-medium">Select a patient to view details</p>
        </div>
      )}
    </div>
  )
}
