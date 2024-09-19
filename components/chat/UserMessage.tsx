// UserMessage.tsx

import React from "react"

export function UserMessage({ children }: { children: React.ReactNode }) {
  return <div className="user-message">{children}</div>
}
