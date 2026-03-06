import React, { useState, useEffect } from 'react'
import { FileText, Download, Activity, HeartPulse, ShieldCheck, Microscope, Layers, UserCircle, Thermometer } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const TABS = ['Overview', 'Lab Reports', 'Prescriptions']

export default function MedicalRecords() {
  const { user } = useAuth()
  const [tab, setTab] = useState('Overview')
  const [records, setRecords] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const isDemoUser = user?.email === 'john@example.com' || user?.email === 'jane@example.com'

  useEffect(() => {
    const fetchData = async () => {
      if (isDemoUser) {
        // John Doe Demo Data
        setRecords([
          { 
            _id: 'r1', 
            recordType: 'Lab Report', 
            title: 'Full Blood Count', 
            createdAt: '2026-02-12', 
            doctor: { name: 'Ravi Kumar' },
            fileUrl: '#' 
          },
          { 
            _id: 'r2', 
            recordType: 'Prescription', 
            title: 'Sumatriptan 50mg', 
            createdAt: '2026-02-15', 
            doctor: { name: 'Priya Sharma' },
            fileUrl: '#',
            status: 'Active'
          },
          { 
            _id: 'r3', 
            recordType: 'Lab Report', 
            title: 'Lipid Profile', 
            createdAt: '2026-01-05', 
            doctor: { name: 'Ravi Kumar' },
            fileUrl: '#' 
          }
        ])
        setProfile({
          bloodGroup: 'B+',
          weight: 72,
          height: 175
        })
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [recordsRes, profileRes] = await Promise.all([
          api.get('/visits'),
          api.get('/patients/me')
        ])
        setRecords(recordsRes.data.data || [])
        setProfile(profileRes.data.data || {})
      } catch (err) {
        console.error('Error fetching records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, isDemoUser])

  const overview = [
    { label: 'Blood Group', value: profile?.bloodGroup || (isDemoUser ? 'B+' : '??'), icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Weight', value: profile?.weight ? `${profile.weight} kg` : '-- kg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Height', value: profile?.height ? `${profile.height} cm` : '-- cm', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: ShieldCheck, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  const labReports = records.filter(r => r.recordType === 'Lab Report' || r.type === 'Lab Report')
  const prescriptions = records.filter(r => r.recordType === 'Prescription' || r.type === 'Prescription')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2"><Layers size={24} className="text-blue-600" /> Medical Records</h1>
          <p className="section-subtitle">Manage your health history and medical documents</p>
        </div>
      </div>

      {/* Tab Navigation */}
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

      {/* Tab Content */}
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
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase">Doctor</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 tracking-wider uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {labReports.length > 0 ? (
                  labReports.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100 shadow-sm">
                            <Microscope size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                            <p className="text-xs font-medium text-gray-500">Pathology</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-medium">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-semibold">Dr. {r.doctor?.name || 'Staff'}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex sm:opacity-0 group-hover:opacity-100">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500 italic">No lab reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Prescriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {prescriptions.length > 0 ? (
            prescriptions.map((m, i) => (
              <div key={i} className="card p-5 border border-gray-100 shadow-sm flex items-start justify-between group hover:border-blue-200 transition-colors">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-inner flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-600">Rx</span>
                  </div>
                  <div className="space-y-1 mt-0.5">
                    <h3 className="font-bold text-gray-900 text-base">{m.title}</h3>
                    <p className="text-sm font-semibold text-blue-600">Issued by Dr. {m.doctor?.name || 'Staff'}</p>
                    <p className="text-xs text-gray-500 font-medium">Date: {new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                    Active
                  </span>
                  <button className="text-gray-400 hover:text-blue-600 mt-2 p-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 italic">No prescriptions found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
