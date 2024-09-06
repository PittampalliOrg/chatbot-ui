// app/[locale]/oauth/layout.tsx

import { ReactNode } from "react"
import { AuthProvider } from "./context/AuthContext"
import { PageLayout } from "./components/PageLayout"

interface OAuthLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export default function OAuthLayout({ children, params }: OAuthLayoutProps) {
  return (
    <AuthProvider>
      <PageLayout>{children}</PageLayout>
    </AuthProvider>
  )
}
