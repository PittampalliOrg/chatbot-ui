import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"

// import { auth } from '@/auth'
import { getChat, getMissingKeys } from "@/app/actions"
import { Chat } from "@/components/chat/chat-ui"
import { AI } from "@/components/stocks/actions"
import { Session } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const supabase = createClient()
  const session = (await supabase.auth.getSession()).data.session as Session

  if (!session) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat || "error" in chat) {
    redirect("/")
  } else {
    return {
      title: chat?.title.toString().slice(0, 50) ?? "Chat"
    }
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = createClient()
  const session = (await supabase.auth.getSession()).data.session as Session
  const missingKeys = await getMissingKeys()

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const userId = session.user.id as string
  const chat = await getChat(params.id, userId)

  if (!chat || "error" in chat) {
    redirect("/")
  } else {
    if (chat?.userId !== session?.user?.id) {
      notFound()
    }

    return (
      <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
        <Chat
          id={chat.id}
          session={session}
          initialMessages={chat.messages}
          missingKeys={missingKeys}
        />
      </AI>
    )
  }
}
