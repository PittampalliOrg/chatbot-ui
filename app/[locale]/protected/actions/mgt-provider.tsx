// components/MgtProvider.tsx
"use client"

import React, { useEffect } from "react"
import { Providers } from "@microsoft/mgt-element"
import { ProxyProvider } from "@microsoft/mgt-proxy-provider"

type MgtProviderProps = {
  children: React.ReactNode
}

const MgtProvider: React.FC<MgtProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize the Proxy Provider if not already initialized
    if (!(Providers.globalProvider instanceof ProxyProvider)) {
      Providers.globalProvider = new ProxyProvider(
        "http://localhost:3000/api/protected/proxy"
      )
    }
  }, [])

  return <>{children}</>
}

export default MgtProvider
