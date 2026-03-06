import React, { useState } from 'react'
import { FileText, Bot, Upload, RefreshCw, AlertTriangle, CheckCircle, Activity, Stethoscope, ChevronRight, ShieldCheck, Calendar } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function ReportSummary() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)

  const handleUpload = (e) => {
    e.preventDefault()
    if (!file) return alert("Please select a file to upload.")

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setReport({
        vitalSigns: "Blood Pressure: 140/90 (High), Heart Rate: 85 bpm (Normal), Temp: 98.6°F (Normal)",
        keyFindings: "Patient reports chronic headaches. Mild hypertension noted. No signs of infection.",
        recommendations: "1. Monitor blood pressure daily.\n2. Reduce sodium intake.\n3. Schedule follow-up in 2 weeks.",
        riskLevel: "Moderate Risk",
        specialist: "Cardiologist",
      })
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn p-6">
        <div className="text-center relative z-10 pt-6 border-b border-gray-100 pb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-6">
            <FileText size={40} className="text-white drop-shadow-md" />
            <Bot size={20} className="text-white absolute bottom-1.5 right-1.5 bg-black/20 p-1 rounded-full backdrop-blur-sm" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">AI Report Summarizer</h1>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto font-medium">Upload complex medical reports and get simple, actionable summaries powered by AI.</p>
        </div>

        {!report ? (
          <div className="card shadow-md border border-indigo-100 p-8 flex flex-col items-center max-w-2xl mx-auto">
            <form className="w-full flex flex-col items-center" onSubmit={handleUpload}>
              <div className="w-full border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center hover:bg-indigo-50/50 hover:border-indigo-400 transition-colors cursor-pointer group mb-6 relative overflow-hidden bg-gray-50/30">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={e => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.png,.jpg" />
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform relative z-10">
                  <Upload size={24} className="text-indigo-500 group-hover:text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 relative z-10">Drag & Drop Report Here</h3>
                <p className="text-sm text-gray-500 mt-1 relative z-10">Supports PDF, DOCX, JPG, PNG (Max 5MB)</p>

                {file && (
                  <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200 inline-flex items-center gap-3 relative z-10">
                    <FileText size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-900">{file.name}</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={!file || loading}
                className="btn-primary w-full max-w-xs py-4 text-base font-bold shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 group disabled:opacity-50 disabled:cursor-not-allowed rounded-xl mb-4">
                {loading ? (
                  <><RefreshCw size={20} className="animate-spin" /> Analyzing Document...</>
                ) : (
                  <><Bot size={20} className="group-hover:scale-110 transition-transform" /> Generate Summary</>
                )}
              </button>
              <p className="text-xs text-gray-400 flex items-center gap-1.5"><ShieldCheck size={14} /> 100% Secure & HIPAA Compliant Analysis</p>
            </form>
          </div>
        ) : (
          <div className="card shadow-xl border-2 border-indigo-100 p-0 relative overflow-hidden animate-fadeInUp">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="p-8 md:p-10 border-b border-gray-100 relative">
              <div className="absolute top-8 right-8 text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Analysis Status</p>
                <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle size={14} /> Complete
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Bot size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">AI Report Analysis</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2"><FileText size={14} /> {file?.name || 'medical_report.pdf'}</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-gray-50/50 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 bg-indigo-50 w-24 h-24 rounded-full blur-2xl opacity-60"></div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2 relative z-10"><Activity size={18} /> Vital Signs extract</h3>
                  <p className="text-gray-800 font-medium relative z-10 leading-relaxed">{report.vitalSigns}</p>
                </div>

                <div className={`p-6 rounded-2xl border-2 shadow-sm ${report.riskLevel.includes('High') ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${report.riskLevel.includes('High') ? 'text-red-700' : 'text-orange-700'}`}><AlertTriangle size={18} /> Risk Assessment</h3>
                  <p className={`text-2xl font-black ${report.riskLevel.includes('High') ? 'text-red-600' : 'text-orange-600'}`}>{report.riskLevel}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><CheckCircle size={18} className="text-emerald-500" /> Key Findings</h3>
                <p className="text-gray-800 font-medium text-lg leading-relaxed">{report.keyFindings}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><Activity size={18} className="text-blue-500" /> AI Recommendations</h3>
                <div className="space-y-3">
                  {report.recommendations.split('\n').map((rec, i) => (
                    <div key={i} className="flex gap-3 items-start bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                      <CheckCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-gray-800 font-medium">{rec.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-700 mb-1 flex items-center gap-2"><Stethoscope size={16} /> Suggested Next Step</h3>
                  <p className="text-gray-900 font-bold text-lg">Consult a {report.specialist}</p>
                </div>
                <button className="btn-primary py-3 px-8 text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 border-none shrink-0 w-full sm:w-auto justify-center">
                  Book Appointment <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100 flex justify-center">
              <button onClick={() => { setReport(null); setFile(null) }} className="text-gray-500 hover:text-indigo-600 font-semibold transition-colors py-2 px-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50">
                Analyze Another Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
