import Navbar from "./components/NavBar"
import MgtProvider from "@/app/[locale]/protected/actions/mgt-provider"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MgtProvider>
        <Navbar />
        {children}
      </MgtProvider>
    </>
  )
}
