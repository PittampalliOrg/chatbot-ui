import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { SidebarButton } from "@/components/ui/sidebar-button"
import { IconPlus, IconX } from "@tabler/icons-react"
import { ContentType } from "@/types/content-type"

interface Props {
  contentType: ContentType
  onNewItem: () => void
  onClearItems: () => void
  isOpen: boolean
  isTyping: boolean
  renderInputs: () => JSX.Element
  onOpenChange: (isOpen: boolean) => void
  createState: any // Add this line
}

export const SidebarCreateItem: FC<Props> = ({
  contentType,
  onNewItem,
  onClearItems,
  isOpen,
  isTyping,
  renderInputs,
  onOpenChange,
  createState // Add this line
}) => {
  const { t } = useTranslation("sidebar")
  const [isCreating, setIsCreating] = useState(false)

  const handleNewItem = () => {
    setIsCreating(true)
    onNewItem()
  }

  const handleClearItems = () => {
    onClearItems()
  }

  const getItemLabel = (contentType: ContentType) => {
    switch (contentType) {
      case "assistants":
        return t("New assistant")
      // Add other cases as needed
      default:
        return t("New item")
    }
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center">
        <SidebarButton
          text={isCreating ? t("Cancel") : getItemLabel(contentType)}
          icon={isCreating ? <IconX size={18} /> : <IconPlus size={18} />}
          onClick={() => {
            if (isCreating) {
              setIsCreating(false)
              onOpenChange(false)
            } else {
              handleNewItem()
              onOpenChange(true)
            }
          }}
          disabled={isTyping}
        />
      </div>
      {isOpen && renderInputs()}
    </div>
  )
}
