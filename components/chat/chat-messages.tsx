// ChatMessages.tsx

"use client"

import React from "react"
import { useUIState } from "ai/rsc"

export type UIMessage = {
  id: string
  role: "user" | "assistant"
  display: React.ReactNode
}

export function ChatMessages() {
  const [messages] = useUIState()

  console.log("ChatMessages - messages:", messages)

  return (
    <div className="chat-messages">
      {messages.map((message: UIMessage) => (
        <div key={message.id}>{message.display}</div>
      ))}
    </div>
  )
}
