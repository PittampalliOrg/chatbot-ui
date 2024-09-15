// app/components/ClientLayout.tsx
"use client"

import React from "react"
import { FluentProvider } from "@fluentui/react-components"
import { useAppContext } from "../AppContext"
import Layout from "../Layout"

export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  const appContext = useAppContext()

  return (
    <FluentProvider theme={appContext.state.theme.fluentTheme}>
      <Layout>{children}</Layout>
    </FluentProvider>
  )
}
