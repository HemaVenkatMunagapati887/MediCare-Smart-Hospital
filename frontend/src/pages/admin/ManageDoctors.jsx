import React from 'react'
import { Users, Activity, Phone, Mail, Edit3, Trash2, ShieldCheck, HeartPulse } from 'lucide-react'

const docs = [
  { id: 1, name: 'Dr. Ravi Kumar', spec: 'Cardiologist', email: 'ravi@medicare.com', phone: '+91 98765 43210', status: 'Active' },
  { id: 2, name: 'Dr. Priya Sharma', spec: 'Neurologist', email: 'priya@medicare.com', phone: '+91 88888 77777', status: 'Active' },
  { id: 3, name: 'Dr. Arjun Mehta', spec: 'Orthopedic', email: 'arjun@medicare.com', phone: '+91 77777 66666', status: 'On Leave' },
]

export default function ManageDoctors() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Manage Doctors</h1>
          <p className="section-subtitle">Add, edit, or remove doctors from the system</p>
        </div>
        <button className="btn-primary flex items-center gap-2 bg-violet-600 hover:bg-violet-700 shadow-md">
          <Users size={18} /> Add New Doctor
        </button>
      </div>

      <div className="card p-0 shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="py-4 px-6">Doctor Info</th>
                <th className="py-4 px-6">Specialization</th>
                <th className="py-4 px-6">Contact Details</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {docs.map(d => (
                <tr key={d.id} className="hover:bg-violet-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center shadow-inner">
                        {d.name.charAt(4)}
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-violet-600 flex items-center gap-1.5"><HeartPulse size={14} /> {d.spec}</span>
                  </td>
                  <td className="py-4 px-6 space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {d.email}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {d.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit ${d.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                      {d.status === 'Active' ? <Activity size={10} /> : <ShieldCheck size={10} />} {d.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center">
                        <Edit3 size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
