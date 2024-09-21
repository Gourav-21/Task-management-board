'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }, [setUser, router])

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await response.json()
          if (data.username) {
            setUser({ username: data.username })
          }
        } catch (e) {
          logout()
          console.error("Failed to initialize user:", e)
        }
      }
      setIsLoading(false)
    }
    initUser()
  }, [logout])


  const login = async (userData: User) => {
    setUser(userData)
    setIsLoading(false)
  }

 

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}