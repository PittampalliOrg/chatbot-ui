import { Button } from "@/components/ui/button"
import Link from "next/link"
import { authProvider } from "./services/auth"
import LoginButton from "./components/LoginButton"
import LogoutButton from "./components/LogoutButton"

export default async function ProtectedHome() {
  const account = await authProvider.getAccount()

  if (!account) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="space-y-4">
          <Button asChild variant="default">
            <Link href="/forced">Go to forced login page</Link>
          </Button>
          <LoginButton />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="space-y-4">
        <Button asChild variant="default">
          <Link href="/profile">Request Profile Information</Link>
        </Button>
        <Button asChild variant="default">
          <Link href="/event">Consent extra permissions and fetch event</Link>
        </Button>
        <LogoutButton />
      </div>
    </main>
  )
}
