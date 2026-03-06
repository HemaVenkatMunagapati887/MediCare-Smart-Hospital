import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, HeartPulse, ShieldCheck } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', terms: false })
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
        setError("Passwords do not match!")
        return;
    }
    if (!form.terms) {
        setError("You must agree to the terms.")
        return;
    }

    setLoading(true)
    setError('')
    try {
        const { register } = await import('../../services/auth')
        await register({
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'patient' // Defaulting registration to patient
        })
        setLoading(false)
        navigate('/patient')
    } catch (err) {
        setError(err.response?.data?.message || err.message || 'Registration failed')
        setLoading(false)
    }
  }

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 bg-gray-50 animate-fadeIn py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-4">
            <HeartPulse size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join MediCare+ for a better healthcare experience</p>
        </div>

        <div className="card shadow-md">
          {error && <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-fadeIn">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input required type="text" value={form.name} onChange={update('name')}
                  placeholder="e.g. John Doe" className="form-input pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input required type="email" value={form.email} onChange={update('email')}
                    placeholder="john@example.com" className="form-input pl-10" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input required type="tel" value={form.phone} onChange={update('phone')}
                    placeholder="+91 XXXXX XXXXX" className="form-input pl-10" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input required type="password" value={form.password} onChange={update('password')}
                    placeholder="••••••••" className="form-input pl-10" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input required type="password" value={form.confirm} onChange={update('confirm')}
                    placeholder="••••••••" className="form-input pl-10" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4 mb-6">
              <div className="flex items-center h-5 mt-1">
                <input id="terms" required type="checkbox" checked={form.terms} onChange={update('terms')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                I agree to the <a href="#" className="font-semibold text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-blue-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {loading ? (
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <><ShieldCheck size={18} /> Create Patient Account</>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
