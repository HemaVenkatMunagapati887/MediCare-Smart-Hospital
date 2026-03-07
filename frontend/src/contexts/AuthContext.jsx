import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [])

  const login = async (creds) => {
    const res = await authService.login(creds)
    setUser(res.data)
    return res
  }

  const googleLogin = async ({ idToken, role }) => {
    const res = await authService.googleLogin({ idToken, role })
    setUser(res.data)
    return res
  }

  // Auto-login: directly set user data (used after registration)
  const loginWithData = (userData) => {
    if (userData && userData.token) {
      localStorage.setItem('sh_user', JSON.stringify(userData))
    }
    setUser(userData)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, loginWithData, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
