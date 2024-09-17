// app/layout.tsx
import "../globals.css"
import { Inter } from "next/font/google"
import MgtProvider from "./actions/mgt-provider"
import Navbar from "../protected/components/NavBar"

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
