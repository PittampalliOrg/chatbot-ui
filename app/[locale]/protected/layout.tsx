import Navbar from "./components/NavBar"

export default function DashboardLayout({
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
