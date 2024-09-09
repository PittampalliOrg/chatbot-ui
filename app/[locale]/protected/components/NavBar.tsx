import Link from "next/link"
import { Button } from "@/components/ui/button"
import WelcomeName from "./WelcomeName"
import ProfilePicture from "./ProfilePicture"
import { logout } from "../actions/auth"
import { login } from "../actions/auth" // Make sure to import the login action
import HomeButton from "./HomeButton"
import { LayoutDashboard } from "lucide-react"
import { authProvider } from "../services/auth"

export default async function NavBar() {
  const account = await authProvider.getAccount()

  const navLinks = [
    { name: "Profile", path: "/protected/profile" },
    { name: "Graph Request", path: "/protected/graph-request" },
    { name: "Events", path: "/protected/event" },
    { name: "Tasks", path: "/protected/tasks" },
    { name: "Token Information", path: "/protected/token-info" }
  ]

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <HomeButton />
          </div>
          <div className="flex items-center space-x-1">
            {navLinks.map(link => (
              <Button key={link.path} asChild variant="ghost" size="sm">
                <Link href={link.path}>{link.name}</Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <WelcomeName />
            <ProfilePicture />
            <form action={account ? logout : login}>
              <Button type="submit" variant="outline" size="sm">
                {account ? "Logout" : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
