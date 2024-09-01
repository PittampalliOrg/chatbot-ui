import { FC, useState } from "react"
import { useTranslation } from "react-i18next"

import { SidebarButton } from "@/components/ui/sidebar-button"
import { IconTrash } from "@tabler/icons-react"

import { ContentType } from "@/types/content-type"

interface Props {
  contentType: ContentType
  item: any
  onDelete: () => void
}

export const SidebarDeleteItem: FC<Props> = ({
  contentType,
  item,
  onDelete
}) => {
  const { t } = useTranslation("sidebar")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteItem(contentType, item)
    onDelete()
    setIsDeleting(false)
  }

  return (
    <SidebarButton
      text={isDeleting ? t("Deleting...") : t("Delete")}
      icon={<IconTrash size={18} />}
      onClick={handleDelete}
      disabled={isDeleting}
    />
  )
}

// Helper functions for deleting items
const deleteItem = async (contentType: ContentType, item: any) => {
  switch (contentType) {
    case "chats":
      return deleteChat(item)
    case "prompts":
      return deletePrompt(item)
    case "collections":
      return deleteCollection(item)
    case "presets":
      return deletePreset(item)
    case "files":
      return deleteFile(item)
    case "models":
      return deleteModel(item)
    case "integrations":
      return deleteIntegration(item)
    default:
      throw new Error(`Unknown content type: ${contentType}`)
  }
}

const deleteChat = async (chat: any) => {
  // Implement chat deletion logic
  console.log("Deleting chat:", chat)
}

const deletePrompt = async (prompt: any) => {
  // Implement prompt deletion logic
  console.log("Deleting prompt:", prompt)
}

const deleteCollection = async (collection: any) => {
  // Implement collection deletion logic
  console.log("Deleting collection:", collection)
}

const deletePreset = async (preset: any) => {
  // Implement preset deletion logic
  console.log("Deleting preset:", preset)
}

const deleteFile = async (file: any) => {
  // Implement file deletion logic
  console.log("Deleting file:", file)
}

const deleteModel = async (model: any) => {
  // Implement model deletion logic
  console.log("Deleting model:", model)
}

const deleteIntegration = async (integration: any) => {
  // Implement integration deletion logic
  console.log("Deleting integration:", integration)
}

// Example usage
export const SidebarDeleteItemWrapper: FC = () => {
  const [items, setItems] = useState<any[]>([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" }
  ])
  const contentType: ContentType = "chats" // This should be dynamically set based on your app's state

  const handleDelete = (itemToDelete: any) => {
    setItems(items.filter(item => item.id !== itemToDelete.id))
  }

  return (
    <div>
      {items.map(item => (
        <SidebarDeleteItem
          key={item.id}
          contentType={contentType}
          item={item}
          onDelete={() => handleDelete(item)}
        />
      ))}
    </div>
  )
}
