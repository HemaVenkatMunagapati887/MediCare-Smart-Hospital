import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Video, FileText, CheckCircle, Search, Save, Upload, Activity, AlertCircle, X, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function Diagnosis() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [patientId, setPatientId] = useState('')
  const [diag, setDiag] = useState('')
  const [rx, setRx] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(true)

  const isDemoDoctor = user?.email === 'sneha@medicare.com' || user?.email === 'suresh@medicare.com'

  useEffect(() => {
    const fetchPatients = async () => {
      if (isDemoDoctor) {
        setAppointments([
          { _id: 'd1', patient: { _id: 'p1', name: 'Venkat R.' }, timeSlot: '10:30 AM' },
          { _id: 'd2', patient: { _id: 'p2', name: 'Rahul K.' }, timeSlot: '11:00 AM' },
          { _id: 'd3', patient: { _id: 'p3', name: 'Anitha S.' }, timeSlot: '11:30 AM' }
        ])
        setLoadingPatients(false)
        return
      }

      try {
        setLoadingPatients(true)
        const profRes = await api.get('/doctors/me')
        const apptRes = await api.get(`/appointments/doctor/${profRes.data.data._id}`)
        // Filter to in-progress or confirmed only for diagnosis
        setAppointments(apptRes.data.data.filter(a => a.status !== 'cancelled' && a.status !== 'completed'))
      } catch (err) {
        console.error("Diagnosis patient fetch error:", err)
      } finally {
        setLoadingPatients(false)
      }
    }

    if (user) fetchPatients()
  }, [user, isDemoDoctor])

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (isDemoDoctor) {
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setPatientId(''); setDiag(''); setRx(''); setNotes('')
      }, 3000)
      return
    }

    try {
      // Find the appointment for this patient to mark it as completed
      const appointment = appointments.find(a => a.patient?._id === patientId);
      
      // Create the visit record
      await api.post('/visits', {
        patient: patientId,
        title: diag,
        description: notes,
        recordType: 'Prescription',
        notes: rx
      })

      // Update appointment status to completed if it exists
      if (appointment && !String(appointment._id).startsWith('d')) {
        await api.put(`/appointments/${appointment._id}`, { status: 'completed' })
      }

      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setPatientId(''); setDiag(''); setRx(''); setNotes('')
      }, 3000)
    } catch (err) {
      console.error("Save diagnosis failed:", err)
    }
  }

  const selectedPatientData = appointments.find(a => a.patient?._id === patientId)

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
        <div className="md:col-span-2 space-y-6 flex flex-col h-full">
          <div className="card shadow-sm border border-gray-100 flex-1">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-teal-600" /> Consultation Notes
            </h2>

            <div className="space-y-5">
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider">Select Patient</label>
                <select required className="form-input focus:ring-teal-500 focus:border-teal-500 bg-gray-50 focus:bg-white" value={patientId} onChange={e => setPatientId(e.target.value)}>
                  <option value="">-- Choose from today's appts --</option>
                  {appointments.map(a => (
                    <option key={a._id} value={a.patient?._id}>{a.patient?.name} ({a.timeSlot})</option>
                  ))}
                  {appointments.length === 0 && !loadingPatients && <option disabled>No active appointments</option>}
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

        <div className="space-y-6">
          <div className="card shadow-sm border border-gray-100 bg-teal-50">
            <h3 className="font-bold text-gray-900 border-b border-teal-100 pb-3 mb-4 text-sm uppercase tracking-wider">Reference Area</h3>
            {!patientId ? (
              <div className="text-center py-6">
                <Search size={32} className="mx-auto text-teal-200 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Select a patient to load their history here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Current Appointment</p>
                  <p className="text-sm font-bold text-gray-900">{selectedPatientData?.timeSlot}</p>
                  <p className="text-xs text-gray-600 mt-1">Status: {selectedPatientData?.status}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Key Detail</p>
                  <p className="text-sm font-bold text-red-700">{isDemoDoctor ? 'Penicillin Allergy' : 'Loading patient records...'}</p>
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

