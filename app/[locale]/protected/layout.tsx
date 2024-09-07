import { PropsWithChildren } from "react"
import NavBar from "./components/NavBar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "MSAL + Next App Router Quickstart",
  description: "Next.js App Router with @azure/msal-node authentication sample."
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen font-sans antialiased">
        <NavBar />
        <div className="container mx-auto px-4">
          <h1 className="my-8 text-center text-2xl font-bold"></h1>
          <div className="flex justify-center">{children}</div>
        </div>
      </body>
    </html>
  )
}
