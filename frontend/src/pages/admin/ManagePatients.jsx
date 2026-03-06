import React, { useState } from 'react'
import { User, Activity, Edit3, Trash2, Calendar, FileText } from 'lucide-react'

const patients = [
  { id: 1, name: 'Venkat R.', age: 28, gender: 'M', blood: 'B+', visits: 8, lastVisit: '15 Feb 2026' },
  { id: 2, name: 'Rahul K.', age: 34, gender: 'M', blood: 'O+', visits: 3, lastVisit: '05 Mar 2026' },
  { id: 3, name: 'Anitha S.', age: 42, gender: 'F', blood: 'A-', visits: 12, lastVisit: '20 Jan 2026' },
]

export default function ManagePatients() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Patient Profiles</h1>
          <p className="section-subtitle">View and manage registered patients</p>
        </div>
      </div>

      <div className="card p-0 shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="py-4 px-6 border-r border-gray-100">Patient Info</th>
                <th className="py-4 px-6 border-r border-gray-100">Health Details</th>
                <th className="py-4 px-6 border-r border-gray-100">Visits history</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-violet-50/30 transition-colors group">
                  <td className="py-4 px-6 border-r border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center shadow-inner">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors block leading-tight">{p.name}</span>
                        <span className="text-xs font-semibold text-gray-400">ID: PT-100{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-gray-50">
                    <div className="flex gap-4 text-xs font-bold text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{p.age} Yrs</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{p.gender}</span>
                      <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded-md flex items-center gap-1">
                        <Activity size={10} /> {p.blood}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-gray-50 space-y-1">
                    <p className="text-xstext-gray-800 font-bold flex items-center gap-1.5"><FileText size={12} className="text-violet-500" /> Total Visits: {p.visits}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" /> Last: {p.lastVisit}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1">
                        <Activity size={12} /> View Records
                      </button>
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
