import React from 'react'
import { Calendar, Clock, Stethoscope, FileText, Download, Activity, HeartPulse } from 'lucide-react'

const history = [
  { id: 1, date: '15 Feb 2026', time: '10:30 AM', doctor: 'Dr. Priya Sharma', spec: 'Neurologist', diag: 'Migraine tracking', rx: 'Paracetamol, Rest', reports: 1 },
  { id: 2, date: '02 Jan 2026', time: '11:00 AM', doctor: 'Dr. Ravi Kumar', spec: 'Cardiologist', diag: 'Routine Checkup', rx: 'Vitamin D3', reports: 2 },
  { id: 3, date: '10 Nov 2025', time: '04:15 PM', doctor: 'Dr. Sneha Patel', spec: 'Pediatrician', diag: 'Viral Fever', rx: 'Antibiotics 5 days', reports: 0 },
  { id: 4, date: '22 Aug 2025', time: '09:45 AM', doctor: 'Dr. Arjun Mehta', spec: 'Orthopedic', diag: 'Knee Pain (Right)', rx: 'Physiotherapy', reports: 1 },
]

export default function VisitHistory() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Visit History</h1>
          <p className="section-subtitle">Chronological record of your hospital visits</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={16} /> Download Full History
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-blue-100 hidden md:block"></div>
        <div className="space-y-6">
          {history.map((v, i) => (
            <div key={v.id} className="flex flex-col md:flex-row gap-4 relative">
              <div className="md:w-32 flex-shrink-0 pt-2 flex items-center md:items-start md:justify-end gap-3 z-10">
                <div className="text-right hidden md:block">
                  <p className="font-bold text-gray-900 text-sm">{v.date.split(' ')[0]}</p>
                  <p className="text-xs text-blue-600 font-medium">{v.date.split(' ').slice(1).join(' ')}</p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1"><Clock size={10} /> {v.time}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
                  <Activity size={12} />
                </div>
                {/* Mobile view date */}
                <div className="md:hidden flex-1">
                  <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> {v.date} <span className="text-xs text-gray-400 font-normal">at {v.time}</span>
                  </p>
                </div>
              </div>

              <div className="flex-1 card p-5 hover:border-blue-200 transition-colors shadow-sm ml-10 md:ml-0 group border border-gray-100 relative">
                {/* Triangle pointer */}
                <div className="absolute top-5 -left-2 w-4 h-4 bg-white border-l border-b border-gray-100 rotate-45 hidden md:block group-hover:border-blue-200 transition-colors"></div>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-gray-50 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-inner">
                      {v.doctor.charAt(4)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{v.doctor}</h3>
                      <p className="text-sm text-blue-600 font-medium flex items-center gap-1.5"><Stethoscope size={14} /> {v.spec}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm border border-emerald-100 flex items-center gap-1">
                    <HeartPulse size={12} /> Completed
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5 focus:outline-none"><Activity size={14} className="text-orange-500" /> Diagnosis</p>
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">{v.diag}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5 focus:outline-none"><FileText size={14} className="text-purple-500" /> Prescription</p>
                    <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">{v.rx}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5">
                    <Download size={14} /> Discharge Summary
                  </button>
                  {v.reports > 0 && (
                    <button className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1.5">
                      <FileText size={14} /> {v.reports} Lab Reports
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
