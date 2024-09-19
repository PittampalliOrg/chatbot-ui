// UserMessage.tsx

import React from "react"

export function UserMessage({ children }: { children: React.ReactNode }) {
  console.log("UserMessage - children:", children)
  return <div className="user-message">{children}</div>
}
