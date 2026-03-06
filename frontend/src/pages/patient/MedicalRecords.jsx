import React, { useState } from 'react'
import { FileText, Download, Activity, HeartPulse, ShieldCheck, Microscope, Layers } from 'lucide-react'

const TABS = ['Overview', 'Lab Reports', 'Prescriptions']

const overview = [
  { label: 'Blood Group', value: 'B+', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Weight', value: '72 kg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Height', value: '175 cm', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Allergies', value: 'Penicillin', icon: ShieldCheck, color: 'text-yellow-600', bg: 'bg-yellow-50' },
]

const reports = [
  { id: 1, name: 'Complete Blood Count (CBC)', date: '15 Feb 2026', doctor: 'Dr. Priya Sharma', type: 'Pathology', status: 'Normal' },
  { id: 2, name: 'Lipid Profile', date: '02 Jan 2026', doctor: 'Dr. Ravi Kumar', type: 'Pathology', status: 'Attention Needed' },
  { id: 3, name: 'Chest X-Ray', date: '10 Nov 2025', doctor: 'Dr. Sneha Patel', type: 'Radiology', status: 'Normal' },
]

const meds = [
  { name: 'Paracetamol 500mg', dosage: '1-0-1 (After Food)', duration: '5 Days', status: 'Active' },
  { name: 'Vitamin D3 60K', dosage: '1 per week', duration: '8 Weeks', status: 'Active' },
  { name: 'Amoxicillin', dosage: '1-1-1 (After Food)', duration: '5 Days', status: 'Completed' },
]

export default function MedicalRecords() {
  const [tab, setTab] = useState('Overview')

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2"><Layers size={24} className="text-blue-600" /> Medical Records</h1>
          <p className="section-subtitle">Manage your health history and medical documents</p>
        </div>
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex overflow-x-auto no-scrollbar w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === t ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}>
            {t === 'Overview' ? <Activity size={16} /> : t === 'Lab Reports' ? <Microscope size={16} /> : <FileText size={16} />}
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
          {overview.map(o => (
            <div key={o.label} className="card p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${o.bg}`}>
                <o.icon size={24} className={o.color} />
              </div>
              <p className="text-sm font-medium text-gray-500">{o.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{o.value}</p>
            </div>
          ))}
          <div className="col-span-full card border-blue-100 bg-blue-50 mt-2 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1"><FileText size={20} className="text-blue-600" /> Download Full Health Summary</h3>
              <p className="text-sm text-gray-600 max-w-xl">Compile all your medical history, vitals, prescriptions, and lab reports into a single PDF document for your next doctor's visit.</p>
            </div>
            <button className="btn-primary whitespace-nowrap px-6 py-3 flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
              <Download size={18} /> Generate PDF
            </button>
          </div>
        </div>
      )}

      {tab === 'Lab Reports' && (
        <div className="card p-0 overflow-hidden border border-gray-100 shadow-sm animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Report Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Prescribed By</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100 shadow-sm">
                          <Microscope size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                          <p className="text-xs font-medium text-gray-500">{r.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">{r.date}</td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-semibold">{r.doctor}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${r.status === 'Normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex opacity-0 group-hover:opacity-100">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Prescriptions' && (
        <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
          {meds.map((m, i) => (
            <div key={i} className="card p-5 border border-gray-100 shadow-sm flex items-start justify-between group hover:border-blue-200 transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-inner flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">Rx</span>
                </div>
                <div className="space-y-1 mt-0.5">
                  <h3 className="font-bold text-gray-900 text-base">{m.name}</h3>
                  <p className="text-sm font-semibold text-blue-600">{m.dosage}</p>
                  <p className="text-xs text-gray-500 font-medium">Duration: {m.duration}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${m.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                  {m.status}
                </span>
                <button className="text-gray-400 hover:text-blue-600 mt-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
