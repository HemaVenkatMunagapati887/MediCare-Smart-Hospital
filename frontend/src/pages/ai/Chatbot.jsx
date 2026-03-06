import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, X, Send, Stethoscope, Clock, Calendar, ShieldCheck, User } from 'lucide-react'
import Navbar from '../../components/Navbar'

const RESPONSES = {
  book: 'To book an appointment, go to Patient Dashboard → Book Appointment. Select your doctor, date, and slot!',
  doctors: 'We have 500+ specialist doctors. You can view all doctors on the Doctors page and filter by specialization!',
  availability: 'Doctors are generally available Monday–Saturday, 9 AM to 5 PM. Emergency care is 24/7.',
  timing: 'Hospital OPD hours: Mon–Fri 8 AM–8 PM, Sat 8 AM–2 PM. Emergency: 24/7.',
  appointment: 'To book an appointment, please log in and visit the Book Appointment section. It only takes 2 minutes!',
  emergency: '⚠️ If this is a medical emergency, please call 102 or visit our emergency ward immediately!',
  records: 'Your medical records can be accessed in Patient Dashboard → Medical Records. All records are secure and private.',
  prescription: 'Your prescriptions are available in Visit History after each consultation. You can download them as PDF.',
  default: "I'm MediCare AI. I can help with booking appointments, finding doctors, hospital timings, and medical records. What would you like to know?",
}

const getResponse = (msg) => {
  const m = msg.toLowerCase()
  if (m.includes('book') || m.includes('appointment')) return RESPONSES.book
  if (m.includes('emergency') || m.includes('urgent')) return RESPONSES.emergency
  if (m.includes('doctor') || m.includes('specialist')) return RESPONSES.doctors
  if (m.includes('available') || m.includes('free')) return RESPONSES.availability
  if (m.includes('time') || m.includes('hours') || m.includes('timing')) return RESPONSES.timing
  if (m.includes('record') || m.includes('history')) return RESPONSES.records
  if (m.includes('prescription') || m.includes('medicine')) return RESPONSES.prescription
  return RESPONSES.default
}

const suggestions = [
  { icon: Calendar, text: 'Book an appointment' },
  { icon: Clock, text: 'Doctor timings' },
  { icon: ShieldCheck, text: 'Emergency contact' },
  { icon: ShieldCheck, text: 'View medical records' },
  { icon: Stethoscope, text: 'Find specialists' }
]

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm MediCare AI Assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, typing])

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(p => [...p, { from: 'user', text: msg, time }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(p => [...p, { from: 'bot', text: getResponse(msg), time }])
    }, 1000 + Math.random() * 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '80vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">MediCare AI Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-blue-200 text-xs">Online — Instant Response</p>
              </div>
            </div>
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-sm">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'bot' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                )}
                <div className={`max-w-[75%] ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2.5`}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === 'user' ? 'text-blue-200 text-right' : 'text-gray-400'}`}>{m.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-2">
                  <Bot size={16} className="text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.map(s => (
                <button key={s.text} onClick={() => send(s.text)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 transition-all flex item-center gap-1.5 flex-shrink-0">
                  <s.icon size={12} className="mt-0.5" /> {s.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button onClick={() => send()}
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-sm">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
