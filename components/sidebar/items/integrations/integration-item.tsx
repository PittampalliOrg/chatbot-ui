import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { INTEGRATION_DESCRIPTION_MAX, INTEGRATION_NAME_MAX } from "@/db/limits"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { FC, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { IconPlug } from "@tabler/icons-react"

interface IntegrationItemProps {
  integration: Tables<"integrations">
}

export const IntegrationItem: FC<IntegrationItemProps> = ({ integration }) => {
  const [name, setName] = useState(integration.name)
  const [isTyping, setIsTyping] = useState(false)
  const [description, setDescription] = useState(integration.description || "")

  const handleInstallToggle = async () => {
    // TODO: Implement the actual installation/uninstallation logic
    console.log(`Toggling installation for ${integration.name}`)
  }

  const handleViewDocs = () => {
    if (integration.documentation_url) {
      window.open(integration.documentation_url, "_blank")
    }
  }

  return (
    <SidebarItem
      item={{
        ...integration,
        sharing: "private", // Add a default sharing value
        file_path: "", // Add a default file_path
        folder_id: null, // Add a default folder_id
        size: 0, // Add a default size
        tokens: 0 // Add a default tokens value
      }}
      isTyping={isTyping}
      contentType={"integrations" as ContentType} // Cast to ContentType
      icon={<IconPlug size={30} />}
      updateState={{ name, description }}
      renderInputs={() => (
        <>
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer underline hover:opacity-50"
              onClick={handleViewDocs}
            >
              View Docs
            </div>
            <Button onClick={handleInstallToggle}>
              {integration.is_installed ? "Uninstall" : "Install"}
            </Button>
          </div>

          <div className="flex flex-col justify-between">
            <div>{integration.type}</div>
            <div>{integration.version}</div>
          </div>

          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="Integration name..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={INTEGRATION_NAME_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Input
              placeholder="Integration description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={INTEGRATION_DESCRIPTION_MAX}
            />
          </div>
        </>
      )}
    />
  )
}
