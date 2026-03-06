import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HeartPulse, User, Stethoscope,
  Lock, Eye, EyeOff, ArrowLeft, CheckCircle2
} from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import api from '../../services/api'

const ROLES = [
  { key: 'patient', label: 'Patient', icon: User,        accent: 'blue', desc: 'Book appointments & manage your health records' },
  { key: 'doctor',  label: 'Doctor',  icon: Stethoscope, accent: 'teal', desc: 'Manage patients, schedules & diagnoses' },
]

const ACCENT = {
  blue:   { card: 'border-blue-300 bg-blue-50',   badge: 'bg-blue-100 text-blue-700 border-blue-200',   icon: 'text-blue-600'   },
  teal:   { card: 'border-teal-300 bg-teal-50',   badge: 'bg-teal-100 text-teal-700 border-teal-200',   icon: 'text-teal-600'   },
  violet: { card: 'border-violet-300 bg-violet-50', badge: 'bg-violet-100 text-violet-700 border-violet-200', icon: 'text-violet-600' },
}

export default function Register() {
  const [step, setStep]               = useState(1)
  const [idToken, setIdToken]         = useState('')
  const [googleUser, setGoogleUser]   = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [showPwd, setShowPwd]         = useState(false)
  const [showCfm, setShowCfm]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const navigate = useNavigate()

  const decodeGoogleToken = (token) => {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(base64))
    } catch { return {} }
  }

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential
    const payload = decodeGoogleToken(token)
    setIdToken(token)
    setGoogleUser({ name: payload.name || '', email: payload.email || '' })
    setError('')
    setStep(2)
  }

  const INSTITUTE_DOMAIN = '@rguktn.ac.in'

  const handleRoleSelect = (role) => {
    if ((role === 'doctor' || role === 'admin') && googleUser) {
      if (!googleUser.email.toLowerCase().endsWith(INSTITUTE_DOMAIN)) {
        setError(
          `Only ${INSTITUTE_DOMAIN} email addresses are allowed for Doctor and Administrator roles. Please use your institutional Google account.`
        )
        return
      }
    }
    setSelectedRole(role)
    setError('')
    setStep(3)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/google-register', { idToken, role: selectedRole, password })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const activeRole = ROLES.find(r => r.key === selectedRole)

  const Spinner = () => (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <HeartPulse size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-1.5 text-sm">MediCare+ · Smart Hospital Portal</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-7">
          {['Google', 'Role', 'Password'].map((label, i) => {
            const s = i + 1
            const done = step > s
            const active = step === s
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? <CheckCircle2 size={16} /> : s}
                  </div>
                  <span className={`text-[11px] font-medium ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                </div>
                {s < 3 && <div className={`w-16 h-0.5 mb-4 transition-all duration-300 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </React.Fragment>
            )
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 animate-fadeIn">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* STEP 1: Google Sign-Up */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">Sign up with Google</h2>
                <p className="text-sm text-gray-500 mt-1">We use your Google account to verify your identity.</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in failed. Please try again.')}
                  text="signup_with"
                  shape="rectangular"
                  size="large"
                  theme="outline"
                  width="320"
                />
                <p className="text-xs text-center text-gray-400 max-w-xs leading-relaxed">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-blue-700 font-semibold mb-2">How registration works</p>
                <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                  <li>Sign in with your Google account</li>
                  <li>Select your role (Patient / Doctor / Admin)</li>
                  <li>Set a password — used for all future logins</li>
                </ol>
              </div>
            </div>
          )}

          {/* STEP 2: Role Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <button type="button" onClick={() => { setStep(1); setError('') }}
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition-colors">
                <ArrowLeft size={15} /> Back
              </button>

              {googleUser && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {googleUser.name?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{googleUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{googleUser.email}</p>
                  </div>
                  <CheckCircle2 size={18} className="text-green-500 ml-auto flex-shrink-0" />
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Select your role</p>
                <div className="flex flex-col gap-3">
                  {ROLES.map(r => {
                    const Icon = r.icon
                    const a = ACCENT[r.accent]
                    const restricted = (r.key === 'doctor' || r.key === 'admin')
                    const eligible = !restricted || (googleUser?.email?.toLowerCase().endsWith('@rguktn.ac.in'))
                    return (
                      <button key={r.key} type="button" onClick={() => handleRoleSelect(r.key)}
                        disabled={!eligible}
                        title={!eligible ? 'Requires @rguktn.ac.in institutional email' : ''}
                        className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          !eligible
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : `hover:shadow-sm ${selectedRole === r.key ? `${a.card} ring-2` : 'border-gray-200 hover:border-gray-300 bg-white'}`
                        }`}>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          r.accent === 'blue' ? 'bg-blue-100' : r.accent === 'teal' ? 'bg-teal-100' : 'bg-violet-100'
                        }`}>
                          <Icon size={22} className={a.icon} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800 text-sm">{r.label}</p>
                            {restricted && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                eligible
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-gray-100 text-gray-400 border-gray-200'
                              }`}>
                                <Lock size={9} /> @rguktn.ac.in only
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Set Password */}
          {step === 3 && (
            <div className="space-y-5">
              <button type="button" onClick={() => { setStep(2); setError('') }}
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition-colors">
                <ArrowLeft size={15} /> Back
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {googleUser && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <CheckCircle2 size={12} /> {googleUser.email}
                  </span>
                )}
                {activeRole && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${ACCENT[activeRole.accent].badge}`}>
                    <activeRole.icon size={12} /> {activeRole.label}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">Set your login password</h2>
                <p className="text-sm text-gray-500 mt-0.5">You'll use your email + this password to sign in.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required type={showPwd ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"
                      className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all" />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required type={showCfm ? 'text' : 'password'} value={confirm}
                      onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password"
                      className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all" />
                    <button type="button" onClick={() => setShowCfm(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCfm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {confirm && password && (
                    <p className={`mt-1.5 text-xs flex items-center gap-1 ${password === confirm ? 'text-green-600' : 'text-red-500'}`}>
                      {password === confirm ? <><CheckCircle2 size={12} /> Passwords match</> : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                  {loading ? <Spinner /> : <><CheckCircle2 size={18} /> Complete Registration</>}
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-gray-400 text-sm mt-7 pt-5 border-t border-gray-100">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
