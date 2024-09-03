import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ChatbotUIContext } from "@/context/context"
import { updateIntegrationActive } from "@/db/integrations"
import { Tables } from "@/supabase/types"
import { FC, useContext, useState } from "react"

interface IntegrationItemProps {
  integration: Tables<"integrations">
  onInstall: () => void
  onUninstall: () => void
}

export const IntegrationItem: FC<IntegrationItemProps> = ({ integration }) => {
  const [isInstalling, setIsInstalling] = useState(false)
  const { integrations, setIntegrations } = useContext(ChatbotUIContext)

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const result = await signIn(integration.name)
      if (result?.error) {
        console.error("Error installing provider:", result.error)
      } else {
        // Fetch the updated session after successful sign-in
        const response = await fetch("/api/auth/session")
        const session = await response.json()
        if (session?.providers) {
          await updateIntegrationActive(integration.id)
          // Update the local state
          setIntegrations(prevIntegrations =>
            prevIntegrations.map(i =>
              i.id === integration.id ? { ...i, active: true } : i
            )
          )
        }
      }
    } catch (error) {
      console.error("Error installing provider:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUninstall = async () => {
    try {
      await signOut()
      await updateIntegrationActive(integration.id)
      // Update the local state
      setIntegrations(prevIntegrations =>
        prevIntegrations.map(i =>
          i.id === integration.id ? { ...i, active: false } : i
        )
      )
    } catch (error) {
      console.error("Error uninstalling provider:", error)
    }
  }

  const handleApiCall = async () => {
    // Implement API call functionality here
    console.log("Making API call for", integration.name)
  }

  return (
    <div className="bg-secondary/50 border-secondary flex flex-col rounded-lg border p-3">
      <div className="mb-2 flex items-center">
        <div className="mr-2 size-6 shrink-0">
          {/* Add icon here if needed */}
        </div>
        <h3 className="grow text-sm font-medium">{integration.name}</h3>
        {integration.active && (
          <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-xs text-green-500">
            Installed
          </span>
        )}
      </div>
      <p className="text-muted-foreground mb-3 text-xs">
        {integration.description}
      </p>
      <div className="flex flex-col space-y-2">
        <Button
          onClick={integration.active ? handleInstall : handleUninstall}
          variant={integration.active ? "secondary" : "default"}
          size="sm"
          className="h-7 w-full py-1 text-xs"
        >
          {integration.active ? "Installed" : "Install"}
        </Button>
        {integration.active && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-full py-1 text-xs"
          >
            Make API Call
          </Button>
        )}
      </div>
    </div>
  )
}
