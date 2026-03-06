import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Stethoscope, FileText, Download, Activity, HeartPulse } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function VisitHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      // Demo Data for John Doe
      if (user?.email === 'john@example.com') {
        setHistory([
          { _id: 'h1', createdAt: '2026-02-15T10:30:00Z', doctor: { name: 'Priya Sharma' }, title: 'Migraine tracking', description: 'Migraine frequency has decreased.' },
          { _id: 'h2', createdAt: '2026-01-02T11:00:00Z', doctor: { name: 'Ravi Kumar' }, title: 'Routine Checkup', description: 'Stable vitals, slightly elevated blood pressure.' },
          { _id: 'h3', createdAt: '2025-11-10T16:15:00Z', doctor: { name: 'Sneha Patel' }, title: 'Viral Fever', description: 'Recovered from mild seasonal fever.' },
          { _id: 'h4', createdAt: '2025-08-22T09:45:00Z', doctor: { name: 'Arjun Mehta' }, title: 'Knee Pain (Right)', description: 'Recommended physiotherapy 2x per week.' },
        ])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await api.get('/visits')
        setHistory(res.data.data || [])
      } catch (err) {
        console.error('Error fetching history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
        {history.length > 0 && <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-blue-100 hidden md:block"></div>}
        <div className="space-y-6">
          {history.length > 0 ? (
            history.map((v, i) => (
              <div key={v._id || i} className="flex flex-col md:flex-row gap-4 relative">
                <div className="md:w-32 flex-shrink-0 pt-2 flex items-center md:items-start md:justify-end gap-3 z-10">
                  <div className="text-right hidden md:block">
                    <p className="font-bold text-gray-900 text-sm">{new Date(v.createdAt).getDate()}</p>
                    <p className="text-xs text-blue-600 font-medium">{new Date(v.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1"><Clock size={10} /> {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
                    <Activity size={12} />
                  </div>
                  <div className="md:hidden flex-1">
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" /> {new Date(v.createdAt).toLocaleDateString()} <span className="text-xs text-gray-400 font-normal">at {new Date(v.createdAt).toLocaleTimeString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex-1 card p-5 hover:border-blue-200 transition-colors shadow-sm ml-10 md:ml-0 group border border-gray-100 relative">
                  <div className="absolute top-5 -left-2 w-4 h-4 bg-white border-l border-b border-gray-100 rotate-45 hidden md:block group-hover:border-blue-200 transition-colors"></div>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-gray-50 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-inner">
                        {v.doctor?.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">Dr. {v.doctor?.name || 'Staff'}</h3>
                        <p className="text-sm text-blue-600 font-medium flex items-center gap-1.5"><Stethoscope size={14} /> Consultation</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm border border-emerald-100 flex items-center gap-1">
                      <HeartPulse size={12} /> Completed
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5 focus:outline-none"><Activity size={14} className="text-orange-500" /> Diagnosis</p>
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">{v.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5 focus:outline-none"><FileText size={14} className="text-purple-500" /> Description</p>
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">{v.description || 'Routine visit.'}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5">
                      <Download size={14} /> Discharge Summary
                    </button>
                    {v.recordType === 'Lab Report' && (
                      <button className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1.5">
                        <FileText size={14} /> View Lab Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <Activity size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No history found</h3>
              <p className="text-gray-500 text-sm">You haven't had any completed medical visits yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


