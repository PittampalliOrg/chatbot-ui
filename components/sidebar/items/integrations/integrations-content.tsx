import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { IntegrationItem, GoogleIcon, MicrosoftIcon } from "./integration-item"
import { signIn } from "next-auth/react"
import { EnrichedSession } from "@/auth"

interface Integration {
  id: string
  name: string
  description: string
  isInstalled: boolean
  icon: React.ReactNode
}

export const IntegrationsContent = () => {
  const { data: session } = useSession()
  const [integrations, setIntegrations] = useState<Integration[]>([])

  useEffect(() => {
    const availableIntegrations: Integration[] = [
      {
        id: "azure-ad",
        name: "Microsoft Azure",
        description:
          "Microsoft Azure Active Directory OAuth provider for enterprise applications.",
        isInstalled: false,
        icon: <MicrosoftIcon />
      },
      {
        id: "google",
        name: "Google",
        description:
          "Google OAuth provider for accessing Google services and user data.",
        isInstalled: false,
        icon: <GoogleIcon />
      }
    ]

    if ((session as EnrichedSession)?.providers) {
      setIntegrations(
        availableIntegrations.map(integration => ({
          ...integration,
          isInstalled: !!(session as EnrichedSession).providers[integration.id]
        }))
      )
    } else {
      setIntegrations(availableIntegrations)
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
