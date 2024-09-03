import { useSession } from "next-auth/react"
import { useContext, useEffect, useState } from "react"
import { IntegrationItem } from "./integration-item"
import { signIn } from "next-auth/react"
import { EnrichedSession } from "@/auth"
import { ChatbotUIContext } from "@/context/context"

interface Integration {
  id: string
  name: string
  description: string
  isInstalled: boolean
  icon: React.ReactNode
}

export const IntegrationsContent = () => {
  const { data: session } = useSession()
  const { integrations, setIntegrations } = useContext(ChatbotUIContext)

  useEffect(() => {
    if ((session as EnrichedSession)?.providers) {
      setIntegrations(
        integrations.map(integration => ({
          ...integration,
          isInstalled: !!(session as EnrichedSession).providers[integration.id]
        }))
      )
    } else {
      setIntegrations(integrations)
    }
  }, [session])

  const handleInstall = (providerId: string) => {
    signIn(providerId)
  }

  const handleUninstall = (providerId: string) => {
    // Implement uninstall logic here
    console.log(`Uninstalling ${providerId}`)
  }

  return (
    <div className="flex flex-col space-y-3 p-3">
      <h2 className="mb-1 text-sm font-semibold">OAuth Providers</h2>
      {integrations.map(integration => (
        <IntegrationItem
          key={integration.id}
          integration={integration}
          onInstall={() => handleInstall(integration.id)}
          onUninstall={() => handleUninstall(integration.id)}
        />
      ))}
    </div>
  )
}
