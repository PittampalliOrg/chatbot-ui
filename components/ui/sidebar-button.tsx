// components/ui/sidebar-button.tsx

import React from "react"
import { Button } from "@/components/ui/button"

export interface SidebarButtonProps {
  text: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "secondary" | "ghost"
  className?: string
  disabled?: boolean // Add the disabled prop
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  text,
  icon,
  onClick,
  variant = "ghost",
  className = "",
  disabled = false // Add a default value
}) => {
  return (
    <Button
      variant={variant}
      className={`w-full justify-start px-2 py-1.5 text-sm ${className}`}
      onClick={onClick}
      disabled={disabled} // Use the disabled prop
    >
      <span className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </span>
    </Button>
  )
}
