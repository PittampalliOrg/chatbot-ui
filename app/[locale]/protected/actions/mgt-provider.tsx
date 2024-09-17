// components/MgtProvider.tsx
"use client"

import React, { useEffect } from "react"
import { Providers } from "@microsoft/mgt-element"
import { ProxyProvider } from "@microsoft/mgt-proxy-provider"

type MgtProviderProps = {
  children: React.ReactNode
}

// Define the API URL based on the environment (production or local)
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://chatbot-ui-livid-mu.vercel.app' 
  : 'http://localhost:3000';

const MgtProvider: React.FC<MgtProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize the Proxy Provider if not already initialized
    if (!(Providers.globalProvider instanceof ProxyProvider)) {
      Providers.globalProvider = new ProxyProvider(
        `${apiUrl}/api/protected/proxy` // Use backticks for proper interpolation
      )
    }
  }, [])

  return <>{children}</>
}

export default MgtProvider
