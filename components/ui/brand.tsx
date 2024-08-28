"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"
import { VPUISVG } from "../icons/vp"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.chatbotui.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
        <VPUISVG
          theme={theme === "dark" ? "dark" : "light"}
          size={200}
          opacity={1}
        />
      </div>

      <div className="text-4xl font-bold tracking-wide"></div>
    </Link>
  )
}
