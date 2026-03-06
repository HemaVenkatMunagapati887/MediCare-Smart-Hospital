import React, { useState } from 'react'
import { Calendar, Clock, Video, FileText, CheckCircle, Search, Save, Upload, Activity, AlertCircle, X, ChevronRight, Check } from 'lucide-react'

export default function Diagnosis() {
  const [patient, setPatient] = useState('')
  const [diag, setDiag] = useState('')
  const [rx, setRx] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setPatient(''); setDiag(''); setRx(''); setNotes('')
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">Add Diagnosis</h1>
        <p className="section-subtitle">Record patient consultation details, symptoms, and prescriptions</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl shadow-sm animate-fadeIn">
          <CheckCircle size={20} className="flex-shrink-0" />
          <p className="font-medium">Record saved successfully! The prescription has been synchronized with the patient's portal.</p>
        </div>
      )}

      <form onSubmit={handleSave} className="grid md:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="md:col-span-2 space-y-6 flex flex-col h-full">
          <div className="card shadow-sm border border-gray-100 flex-1">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-teal-600" /> Consultation Notes
            </h2>

            <div className="space-y-5">
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider">Select Patient</label>
                <select required className="form-input focus:ring-teal-500 focus:border-teal-500 bg-gray-50 focus:bg-white" value={patient} onChange={e => setPatient(e.target.value)}>
                  <option value="">-- Choose from today's appts --</option>
                  <option>Venkat R. (10:30 AM)</option>
                  <option>Rahul K. (11:00 AM)</option>
                  <option>Anitha S. (11:30 AM)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5"><AlertCircle size={14} className="text-orange-500" /> Symptoms & Diagnosis</label>
                <textarea required rows={4} className="form-input resize-none bg-gray-50 focus:bg-white focus:ring-orange-500 focus:border-orange-500" value={diag} onChange={e => setDiag(e.target.value)}
                  placeholder="E.g., Patient experiencing mild chest pain and shortness of breath..." />
              </div>

              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5"><Check size={14} className="text-teal-500" /> Prescribed Medication</label>
                <textarea required rows={4} className="form-input resize-none bg-gray-50 focus:bg-white focus:ring-teal-500 focus:border-teal-500" value={rx} onChange={e => setRx(e.target.value)}
                  placeholder="E.g., 1. Aspirin 75mg (1-0-0) for 30 days&#10;2. Pantoprazole 40mg (1-0-0) before breakfast..." />
              </div>

              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider">Doctor Notes (Internal only)</label>
                <textarea rows={2} className="form-input resize-none bg-gray-50 focus:bg-white" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Private notes, follow-up instructions..." />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Save size={18} /> Save & Finalize Record
          </button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="card shadow-sm border border-gray-100 bg-teal-50">
            <h3 className="font-bold text-gray-900 border-b border-teal-100 pb-3 mb-4 text-sm uppercase tracking-wider">Reference Area</h3>
            {!patient ? (
              <div className="text-center py-6">
                <Search size={32} className="mx-auto text-teal-200 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Select a patient to load their history here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Previous Visit</p>
                  <p className="text-sm font-bold text-gray-900">15 Feb 2026</p>
                  <p className="text-xs text-gray-600 mt-1">Diagnosis: Routine checkup. All vitals normal.</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Allergies</p>
                  <p className="text-sm font-bold text-red-700">Penicillin</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Active Meds</p>
                  <p className="text-sm font-medium text-gray-800">Vitamin D3 60K (Weekly)</p>
                </div>
              </div>
            )}
          </div>

          <div className="card shadow-sm border border-dashed border-gray-300 hover:border-teal-400 transition-colors cursor-pointer text-center group">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-50 transition-colors">
              <Upload size={20} className="text-gray-400 group-hover:text-teal-600" />
            </div>
            <p className="text-sm font-bold text-gray-900 group-hover:text-teal-700">Attach Lab Reports</p>
            <p className="text-xs text-gray-400 mt-1">Drag & drop or browse PDF/JPG</p>
          </div>
        </div>
      </form>
    </div>
  )
}
