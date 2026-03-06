import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { HeartPulse, User, Stethoscope, ShieldCheck, Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login({ email, password: password || 'demo123' })
      const role = res?.data?.role || res?.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'doctor') navigate('/doctor')
      else navigate('/patient')
    } catch (err) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  const demoLogin = (roleEmail) => {
    setEmail(roleEmail)
    setPassword('demo123')
    setTimeout(() => {
      document.getElementById('login-btn').click()
    }, 100)
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 bg-gray-50 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-4">
            <HeartPulse size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to MediCare+ Hospital</p>
        </div>

        <div className="card shadow-md">
          {/* Quick Demo Login */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => demoLogin('patient@gmail.com')} className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all border border-blue-100">
                <User size={18} />
                <span className="text-xs font-semibold">Patient</span>
              </button>
              <button type="button" onClick={() => demoLogin('doctor@gmail.com')} className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all border border-teal-100">
                <Stethoscope size={18} />
                <span className="text-xs font-semibold">Doctor</span>
              </button>
              <button type="button" onClick={() => demoLogin('admin@medicare.com')} className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all border border-violet-100">
                <ShieldCheck size={18} />
                <span className="text-xs font-semibold">Admin</span>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400 text-xs">or sign in manually</span>
            </div>
          </div>

          {error && <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-fadeIn">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="form-input pl-10" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="form-input pl-10" />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>

            <button id="login-btn" type="submit" disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <>SignIn <LogIn size={18} /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
