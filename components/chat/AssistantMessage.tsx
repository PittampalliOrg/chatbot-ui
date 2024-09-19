// AssistantMessage.tsx

import React from "react"
import { useStreamableValue, StreamableValue } from "ai/rsc"

export function AssistantMessage({
  content
}: {
  content: StreamableValue<string>
}) {
  const [value, error] = useStreamableValue(content)

  console.log("AssistantMessage - value:", value)

  if (error) {
    return <div className="assistant-message error">Error: {String(error)}</div>
  }

  return <div className="assistant-message">{value ?? ""}</div>
}
