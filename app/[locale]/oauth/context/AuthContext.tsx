// app/[locale]/oauth/context/AuthContext.tsx
"use client"

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from "react"

interface AuthContextType {
  account: any | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (postLoginRedirectUri?: string, scopesToConsent?: string) => void
  logout: (postLogoutRedirectUri?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = (postLoginRedirectUri?: string, scopesToConsent?: string) => {
    let url = "/api/auth/login"
    const searchParams = new URLSearchParams()

    if (postLoginRedirectUri) {
      searchParams.append(
        "postLoginRedirectUri",
        encodeURIComponent(postLoginRedirectUri)
      )
    }

    if (scopesToConsent) {
      searchParams.append(
        "scopesToConsent",
        encodeURIComponent(scopesToConsent)
      )
    }

    url = `${url}?${searchParams.toString()}`
    window.location.replace(url)
  }

  const logout = (postLogoutRedirectUri?: string) => {
    setIsAuthenticated(false)
    setAccount(null)

    let url = "/api/auth/logout"
    const searchParams = new URLSearchParams()

    if (postLogoutRedirectUri) {
      searchParams.append(
        "postLogoutRedirectUri",
        encodeURIComponent(postLogoutRedirectUri)
      )
    }

    url = `${url}?${searchParams.toString()}`
    window.location.replace(url)
  }

  const getAccount = async () => {
    try {
      const response = await fetch("/api/auth/account")
      const data = await response.json()
      setIsAuthenticated(!!data)
      setAccount(data)
    } catch (error) {
      console.error("Error fetching account:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        account,
        isLoading,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
