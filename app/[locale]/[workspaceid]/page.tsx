import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"
import { AI } from "@/components/stocks/actions"

export default function WorkspacePage() {
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  return (
    <AI>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="text-4xl">{selectedWorkspace?.name}</div>
      </div>
    </AI>
  )
}
