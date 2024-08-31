"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ChatbotUIContext } from "@/context/context"
import { signIn } from "next-auth/react"
import { useState, useContext } from "react"

interface OAuthProvider {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface OAuthProviderCardProps {
  provider: OAuthProvider
}

export function OAuthProviderCard({ provider }: OAuthProviderCardProps) {
  const { oauthProviders, setOauthProviders } = useContext(ChatbotUIContext)
  const [isInstalling, setIsInstalling] = useState(false)

  const isInstalled = !!oauthProviders[provider.id]
  const accessToken = oauthProviders[provider.id]?.accessToken

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const result = await signIn(provider.id, {
        callbackUrl: "/apps",
        redirect: false
      })
      if (result?.error) {
        console.error("Error installing provider:", result.error)
      } else {
        // Fetch the updated session after successful sign-in
        const response = await fetch("/api/auth/session")
        const session = await response.json()
        if (session?.providers) {
          setOauthProviders(session.providers)
        }
      }
    } catch (error) {
      console.error("Error installing provider:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleMakeApiCall = async () => {
    if (!accessToken) return

    try {
      const response = await fetch(`/api/${provider.id}/example`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      console.log(`API call result for ${provider.name}:`, data)
    } catch (error) {
      console.error(`Error making API call to ${provider.name}:`, error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          {provider.icon}
          <div>
            <CardTitle>{provider.name}</CardTitle>
            {isInstalled && (
              <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                Installed
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{provider.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleInstall}
          disabled={isInstalled || isInstalling}
          className="w-full"
        >
          {isInstalled
            ? "Installed"
            : isInstalling
              ? "Installing..."
              : "Install"}
        </Button>
        {isInstalled && (
          <Button onClick={handleMakeApiCall} className="w-full">
            Make API Call
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
