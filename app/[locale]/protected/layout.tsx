// app/layout.tsx
import "../globals.css"
import { Inter } from "next/font/google"
import ClientAppProvider from "./mgt/components/ClientAppProvider"
import ClientLayout from "./mgt/components/ClientLayout"
import MgtProvider from "./actions/mgt-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "My App",
  description: "My App description"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex size-full flex-col">
      <Navbar />
      <div className="grow overflow-auto">{children}</div>
    </div>
  )
}
