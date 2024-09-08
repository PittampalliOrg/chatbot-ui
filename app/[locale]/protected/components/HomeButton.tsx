"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { redirectToHome } from "../actions/home-redirect"
import { useState } from "react"
import { Home as HomeIcon } from "lucide-react"

export default function HomeButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleHomeClick = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const redirectUrl = await redirectToHome()
      router.push(redirectUrl)
    } catch (error) {
      console.error("Error redirecting to home:", error)
      router.push("/chat") // Fallback to default chat page
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleHomeClick}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className=""
        disabled={isLoading}
      >
        <HomeIcon className="mr-2 size-4" />
        {isLoading ? "Redirecting..." : "Home"}
      </Button>
    </form>
  )
}