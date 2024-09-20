import { nanoid } from "@/lib/utils"
import { Chat } from "@/components/chat/chat-ui"
import { AI } from "@/components/stocks/actions"
// import { auth } from '@/auth'
import { Session } from "@/lib/types"
import { getMissingKeys } from "@/app/actions"

export const metadata = {
  title: "Next.js AI Chatbot"
}

export default async function IndexPage() {
  const id = nanoid()
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} missingKeys={missingKeys} />
    </AI>
  )
}
