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

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
