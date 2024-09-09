"use client"

import { useState, useContext, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChatbotUIContext } from "@/context/context"
import { IconPlug } from "@tabler/icons-react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { WithTooltip } from "../ui/with-tooltip"
import { login, logout } from "@/app/[locale]/protected/actions/auth"

interface OAuthIntegration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isInstalled: boolean
}

const OAUTH_INTEGRATIONS: OAuthIntegration[] = [
  {
    id: "google",
    name: "Google",
    description:
      "Connect your Google account to access various Google services.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    isInstalled: false
  },
  {
    id: "azure",
    name: "Azure",
    description: "Integrate with Microsoft Azure for cloud computing services.",
    icon: (
      <svg viewBox="0 0 23 23" className="size-6">
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
    ),
    isInstalled: false
  }
]

export const OAuthIntegrations = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedWorkspace } = useContext(ChatbotUIContext)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const oauthOpen = searchParams.get("oauthOpen")
    if (oauthOpen === "true") {
      setIsOpen(true)
    }
  }, [searchParams])

  const handleAction = async (
    action: typeof login | typeof logout,
    integration: OAuthIntegration
  ) => {
    const formData = new FormData()
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.set("oauthOpen", "true")
    formData.append("origin", `${pathname}?${currentParams.toString()}`)
    formData.append("integration", integration.id)
    await action(null, formData)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    const newParams = new URLSearchParams(searchParams.toString())
    if (open) {
      newParams.set("oauthOpen", "true")
    } else {
      newParams.delete("oauthOpen")
    }
    router.push(`${pathname}?${newParams.toString()}`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <WithTooltip
          display={<div>OAuth Integrations</div>}
          trigger={
            <IconPlug
              className="ml-3 cursor-pointer pr-[5px] hover:opacity-50"
              size={32}
              onClick={() => handleOpenChange(true)}
            />
          }
        />
      </SheetTrigger>

      <SheetContent className="flex flex-col justify-between" side="left">
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle>OAuth Integrations</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {OAUTH_INTEGRATIONS.map(integration => (
              <div
                key={integration.id}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="size-10 shrink-0">{integration.icon}</div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-gray-500">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    handleAction(
                      integration.isInstalled ? logout : login,
                      integration
                    )
                  }
                  variant={integration.isInstalled ? "destructive" : "default"}
                >
                  {integration.isInstalled ? "Uninstall" : "Install"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleOpenChange(false)}>Close</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
