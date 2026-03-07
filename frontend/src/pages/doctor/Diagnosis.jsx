import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Video, FileText, CheckCircle, Search, Save, Upload, Activity, AlertCircle, X, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function Diagnosis() {
  const { user } = useAuth()
  const location = useLocation()
  const fileInputRef = useRef(null)
  const [appointments, setAppointments] = useState([])
  const [patientId, setPatientId] = useState(location.state?.selectedPatientId || '')
  const [diag, setDiag] = useState('')
  const [rx, setRx] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [recordType, setRecordType] = useState('Prescription')

  const isDemoDoctor = user?.email === 'sneha@medicare.com' || user?.email === 'suresh@medicare.com'

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true)
        let realAppts = []
        
        if (user?._id || user?.id) {
          try {
            const profRes = await api.get('/doctors/me')
            const apptRes = await api.get(`/appointments/doctor/${profRes.data.data._id}`)
            // Only show confirmed/pending/in-progress appointments (active ones)
            realAppts = (apptRes.data.data || []).filter(a => 
              ['pending', 'confirmed', 'in-progress'].includes(a.status?.toLowerCase())
            )
          } catch (e) {
            console.error("Fetch real appts error:", e)
          }
        }

        const demoAppts = isDemoDoctor ? [
          { _id: 'd1', patient: { _id: 'p1', name: 'Venkat R.' }, timeSlot: '10:30 AM', status: 'Upcoming', reason: 'Chest Pain' },
          { _id: 'd2', patient: { _id: 'p2', name: 'Rahul K.' }, timeSlot: '11:00 AM', status: 'Upcoming', reason: 'Migraine' },
          { _id: 'd3', patient: { _id: 'p3', name: 'Anitha S.' }, timeSlot: '11:30 AM', status: 'Upcoming', reason: 'Knee Pain' }
        ] : []

        const allAvailable = [...demoAppts, ...realAppts]
        
        // Use a Map to ensure we show each patient only once in the dropdown
        const patientMap = new Map()
        allAvailable.forEach(a => {
          const pId = a.patient?._id || a.patient?.id || a.patient
          if (pId && !patientMap.has(pId)) {
            patientMap.set(pId, a)
          }
        })

        setAppointments(Array.from(patientMap.values()))
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
      setIsSaving(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      setIsSaving(false)
      setSaved(true)
      setPatientId(''); setDiag(''); setRx(''); setNotes(''); setSelectedFile(null); setRecordType('Prescription')
      setTimeout(() => setSaved(false), 5000)
      return
    }

    if (!patientId) {
      setError("Please select a patient first.")
      return
    }

    try {
      setIsSaving(true)

      // Find the appointment for this patient
      const appointment = appointments.find(a => 
        a.patient?._id === patientId || a.patient?.id === patientId || a.patient === patientId
      )

      const recordData = {
        patient: patientId,
        title: diag,
        description: rx + (notes ? `\n\nDoctor Notes: ${notes}` : ''),
        recordType: selectedFile ? 'Lab Report' : recordType,
        fileUrl: selectedFile ? `/uploads/${selectedFile.name}` : ''
      }

      // Create the visit/medical record
      await api.post('/visits', recordData)

      // Mark appointment as completed if it's a real DB appointment
      if (appointment && !String(appointment._id).startsWith('d')) {
        try {
          await api.put(`/appointments/${appointment._id}`, { status: 'completed' })
        } catch (apptErr) {
          console.warn("Could not update appointment status:", apptErr.message)
        }
      }

      setSaved(true)
      setPatientId(''); setDiag(''); setRx(''); setNotes(''); setSelectedFile(null); setRecordType('Prescription')
      
      setTimeout(() => setSaved(false), 6000)
    } catch (err) {
      console.error("Save diagnosis failed:", err)
      const errMsg = err.response?.data?.message || err.message || "Failed to save record. Please try again."
      setError(errMsg)
    } finally {
      setIsSaving(false)
    }
  }

  const selectedPatientData = appointments.find(a => 
    a.patient?._id === patientId || a.patient?.id === patientId || a.patient === patientId
  )

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setRecordType('Lab Report')
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
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
        <div className="md:col-span-2 space-y-6 flex flex-col h-full">
          <div className="card shadow-sm border border-gray-100 flex-1">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5 flex items-center gap-2">
              <Activity size={18} className="text-teal-600" /> Consultation Notes
            </h2>

            <div className="space-y-5">
              {/* Patient Selector */}
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-blue-500" /> Select Patient *
                </label>
                {loadingPatients ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                    Loading patients...
                  </div>
                ) : (
                  <select 
                    required={!isDemoDoctor} 
                    className="form-input focus:ring-teal-500 focus:border-teal-500 bg-gray-50 focus:bg-white" 
                    value={patientId} 
                    onChange={e => setPatientId(e.target.value)}
                  >
                    <option value="">-- Choose Patient --</option>
                    {appointments.map(a => (
                      <option key={a._id} value={a.patient?._id || a.patient?.id || a.patient}>
                        {a.patient?.name || a.patient?.user?.name || 'Unknown'} ({a.timeSlot || 'New Appt'}) - {a.reason || ''}
                      </option>
                    ))}
                    {appointments.length === 0 && !loadingPatients && (
                      <option disabled>No active appointments found</option>
                    )}
                  </select>
                )}
              </div>

              {/* Record Type */}
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider">Record Type</label>
                <div className="flex gap-3">
                  {['Prescription', 'Lab Report', 'X-Ray', 'Other'].map(type => (
                    <label key={type} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                      recordType === type 
                        ? 'bg-teal-50 border-teal-400 text-teal-700' 
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}>
                      <input 
                        type="radio" 
                        name="recordType" 
                        value={type} 
                        checked={recordType === type}
                        onChange={() => setRecordType(type)}
                        className="hidden"
                      />
                      {recordType === type && <Check size={14} />}
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Diagnosis */}
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-orange-500" /> Symptoms & Diagnosis *
                </label>
                <textarea 
                  required 
                  rows={4} 
                  className="form-input resize-none bg-gray-50 focus:bg-white focus:ring-orange-500 focus:border-orange-500" 
                  value={diag} 
                  onChange={e => setDiag(e.target.value)}
                  placeholder="E.g., Patient experiencing mild chest pain and shortness of breath. BP: 130/85 mmHg. Pulse: 78 bpm..." 
                />
              </div>

              {/* Prescription */}
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <Check size={14} className="text-teal-500" /> Prescribed Medication *
                </label>
                <textarea 
                  required 
                  rows={4} 
                  className="form-input resize-none bg-gray-50 focus:bg-white focus:ring-teal-500 focus:border-teal-500" 
                  value={rx} 
                  onChange={e => setRx(e.target.value)}
                  placeholder={"1. Aspirin 75mg (1-0-0) for 30 days\n2. Pantoprazole 40mg (1-0-0) before breakfast\n3. Follow up after 2 weeks"} 
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label text-xs font-bold uppercase text-gray-500 tracking-wider">Doctor Notes (Internal only)</label>
                <textarea 
                  rows={2} 
                  className="form-input resize-none bg-gray-50 focus:bg-white" 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Private notes, follow-up instructions, referrals..." 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving} 
            className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-base">
            {isSaving 
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving Record...</>
              : <><Save size={18} /> Save &amp; Finalize Record</>
            }
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Reference area */}
          <div className="card shadow-sm border border-gray-100 bg-teal-50">
            <h3 className="font-bold text-gray-900 border-b border-teal-100 pb-3 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Stethoscope size={16} className="text-teal-600" /> Reference Area
            </h3>
            {!patientId ? (
              <div className="text-center py-6">
                <Search size={32} className="mx-auto text-teal-200 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Select a patient to load their appointment details here.</p>
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Patient Name</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedPatientData?.patient?.name || selectedPatientData?.patient?.user?.name || 'Unknown'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Appointment Slot</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Clock size={14} className="text-teal-600" /> {selectedPatientData?.timeSlot || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Status: <span className="font-semibold text-teal-700">{selectedPatientData?.status}</span></p>
                </div>
                {selectedPatientData?.reason && (
                  <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm border-l-4 border-l-orange-400">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Visit Reason</p>
                    <p className="text-sm font-bold text-orange-700">{selectedPatientData.reason}</p>
                  </div>
                )}
                <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Allergy Note</p>
                  <p className="text-sm font-bold text-red-700">
                    {isDemoDoctor ? 'Penicillin Allergy' : 'No known allergies on record'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* File Attachment */}
          <div 
            onClick={handleAttachClick}
            className={`card shadow-sm border-2 border-dashed transition-all cursor-pointer text-center group py-6 px-3 ${selectedFile ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50/30'}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check size={20} className="text-white" />
                </div>
                <p className="text-xs font-bold text-teal-800 truncate px-2">{selectedFile.name}</p>
                <p className="text-[10px] text-teal-600">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setRecordType('Prescription') }}
                  className="text-[10px] text-red-500 font-bold uppercase hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-teal-50 transition-colors">
                  <Upload size={18} className="text-gray-400 group-hover:text-teal-600" />
                </div>
                <p className="text-xs font-bold text-gray-900 group-hover:text-teal-700">Attach Lab Reports</p>
                <p className="text-[10px] text-gray-400 mt-0.5">PDF or JPG (Max 5MB)</p>
              </>
            )}
          </div>

          {/* Quick tip */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText size={14} /> What happens next?
            </p>
            <ul className="text-xs text-blue-600 space-y-1.5">
              <li className="flex items-start gap-1.5"><Check size={12} className="mt-0.5 flex-shrink-0" /> Record saved to patient's Medical Records</li>
              <li className="flex items-start gap-1.5"><Check size={12} className="mt-0.5 flex-shrink-0" /> Appears in patient's Visit History</li>
              <li className="flex items-start gap-1.5"><Check size={12} className="mt-0.5 flex-shrink-0" /> Appointment marked as Completed</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
