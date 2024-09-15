"use client"

// app/AppContext.tsx
import { Theme } from "@fluentui/react-components"
import React, { Dispatch, SetStateAction } from "react"

type AppContextState = {
  searchTerm: string
  sidebar: { isMinimized: boolean }
  theme: { key: string; fluentTheme: Theme }
}

type AppContextValue = {
  state: AppContextState
  setState: Dispatch<SetStateAction<AppContextState>>
}

export const AppContext = React.createContext<AppContextValue | undefined>(
  undefined
)

export function useAppContext() {
  const value = React.useContext(AppContext)
  if (value === undefined)
    throw new Error(
      "Expected an AppProvider somewhere in the react tree to set context value"
    )
  return value
}
