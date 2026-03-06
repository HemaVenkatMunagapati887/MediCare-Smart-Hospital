import React, { useState } from 'react'
import { Bot, Search, AlertCircle, ArrowRight, ShieldCheck, Activity, Stethoscope } from 'lucide-react'

const symptomsData = [
  { id: 'fever', label: 'Fever' }, { id: 'cough', label: 'Cough' },
  { id: 'headache', label: 'Headache' }, { id: 'fatigue', label: 'Fatigue' },
  { id: 'nausea', label: 'Nausea' }, { id: 'chest_pain', label: 'Chest Pain' },
  { id: 'dizziness', label: 'Dizziness' }, { id: 'sore_throat', label: 'Sore Throat' }
]

export default function SymptomChecker() {
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggle = (id) => {
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  const analyze = () => {
    if (selected.length === 0) return alert("Select at least one symptom")
    setLoading(true)
    setTimeout(() => {
      // Mock logic based on selections
      let condition = "Viral Fever"
      let dept = "General Physician"
      let urgency = "Medium"

      if (selected.includes('chest_pain')) {
        condition = "Potential Cardiac Issue"
        dept = "Cardiologist"
        urgency = "High (Severe)"
      } else if (selected.includes('headache') && selected.includes('nausea')) {
        condition = "Migraine"
        dept = "Neurologist"
        urgency = "Low"
      }

      setResult({ condition, dept, urgency })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 mt-6 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-6">
          <Bot size={40} className="text-white drop-shadow-md" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">AI Symptom Checker</h1>
        <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto font-medium">Select your symptoms and get an instant, AI-powered preliminary assessment.</p>
      </div>

      {!result ? (
        <div className="card shadow-lg border border-indigo-100 p-8 relative overflow-hidden animate-fadeIn">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2 relative z-10"><Activity className="text-indigo-600" /> What are you experiencing?</h3>
          <div className="flex flex-wrap gap-3 mb-10 relative z-10">
            {symptomsData.map(s => {
              const isActive = selected.includes(s.id)
              return (
                <button key={s.id} onClick={() => toggle(s.id)}
                  className={`px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 shadow-sm ${isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 transform scale-105 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}>
                  {s.label}
                </button>
              )
            })}
          </div>

          <div className="relative z-10 flex flex-col items-center border-t border-gray-100 pt-8 mt-4">
            <button onClick={analyze} disabled={selected.length === 0 || loading}
              className="btn-primary w-full md:w-auto md:px-12 py-4 text-lg font-bold shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Analyzing...</>
              ) : (
                <><Search className="group-hover:scale-110 transition-transform" /> Analyze Symptoms</>
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 flex items-center gap-1.5 justify-center font-medium max-w-sm">
              <ShieldCheck size={14} /> This is an AI tool, not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      ) : (
        <div className="card shadow-xl border-2 border-indigo-100 p-8 md:p-10 relative overflow-hidden animate-fadeInUp">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="text-center mb-10 pt-4">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
              <Bot size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Analysis Complete</h2>
            <p className="text-gray-500 font-medium">Based on {selected.length} symptom{selected.length > 1 ? 's' : ''} reported</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className={`p-6 rounded-2xl border-2 ${result.urgency.includes('High') ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={20} className={result.urgency.includes('High') ? 'text-red-500' : 'text-gray-400'} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Urgency Level</p>
              </div>
              <p className={`text-2xl font-black ${result.urgency.includes('High') ? 'text-red-600' : 'text-gray-900'}`}>{result.urgency}</p>
            </div>

            <div className="p-6 rounded-2xl border-2 bg-indigo-50 border-indigo-100 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={20} className="text-indigo-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Possible Condition</p>
              </div>
              <p className="text-2xl font-black text-indigo-900">{result.condition}</p>

              <div className="mt-5 pt-5 border-t border-indigo-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">Recommended Specialist</p>
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2"><Stethoscope size={18} className="text-indigo-600" /> {result.dept}</p>
                </div>
                <button className="btn-primary py-2.5 px-6 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 border-none">
                  Find Doctor <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center border-t border-gray-100 pt-6">
            <button onClick={() => { setResult(null); setSelected([]) }} className="text-gray-500 hover:text-indigo-600 font-semibold text-sm transition-colors py-2 px-4 rounded-lg hover:bg-indigo-50">
              Check New Symptoms
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
