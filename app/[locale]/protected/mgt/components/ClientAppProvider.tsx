// app/components/ClientAppProvider.tsx
"use client"

import React from "react"
import { AppContext } from "../AppContext"
import { webLightTheme } from "@fluentui/react-components"

export default function ClientAppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [state, setState] = React.useState({
    searchTerm: "*",
    sidebar: {
      isMinimized: false
    },
    theme: { key: "light", fluentTheme: webLightTheme }
  })

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}
