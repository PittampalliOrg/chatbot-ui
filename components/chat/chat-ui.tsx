// ChatUI.tsx

"use client"

import React, { useContext, useEffect, useState } from "react"
import { useAIState, useUIState } from "ai/rsc"
import { useParams } from "next/navigation"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { getMessagesByChatId } from "@/db/messages"
import { AIMessage, UIMessage } from "@/app/ai"
import { AssistantMessage } from "./AssistantMessage"
import { UserMessage } from "./UserMessage"
import Loading from "@/app/[locale]/loading"
import { ChatScrollButtons } from "./chat-scroll-buttons"
import { ChatSecondaryButtons } from "./chat-secondary-buttons"
import { ChatHelp } from "./chat-help"
import { useScroll } from "@/components/chat/chat-hooks/use-scroll"
import { ChatbotUIContext } from "@/context/context"

export const ChatUI: React.FC = () => {
  const params = useParams()
  const [aiMessages, setAIMessages] = useAIState()
  const [uiMessages, setUIMessages] = useUIState()
  const [loading, setLoading] = useState(true)

  const { selectedChat } = useContext(ChatbotUIContext)

  const {
    handleScroll,
    scrollToBottom,
    scrollToTop,
    isAtTop,
    isAtBottom,
    isOverflowing
  } = useScroll()

  useEffect(() => {
    const fetchData = async () => {
      await fetchMessages()
      // Fetch other data as needed
      setLoading(false)
    }

    if (params.chatid) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [params.chatid])

  const fetchMessages = async () => {
    const fetchedMessages = await getMessagesByChatId(params.chatid as string)

    // Map fetched messages to AI messages
    const aiMessages: AIMessage[] = fetchedMessages.map(message => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: message.content
    }))

    setAIMessages(aiMessages)

    // In the fetchMessages function or wherever you map messages:

    const uiMessages: UIMessage[] = fetchedMessages.map(message => {
      const role = message.role as "user" | "assistant"
      const display =
        role === "user" ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          // Render assistant messages directly
          <div className="assistant-message">{message.content}</div>
        )
      return {
        id: message.id,
        role,
        display
      }
    })
    setUIMessages(uiMessages)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="relative flex h-full flex-col items-center">
        <div className="absolute left-4 top-2.5 flex justify-center">
          <ChatScrollButtons
            isAtTop={isAtTop}
            isAtBottom={isAtBottom}
            isOverflowing={isOverflowing}
            scrollToTop={scrollToTop}
            scrollToBottom={scrollToBottom}
          />
        </div>

        <div className="absolute right-4 top-1 flex h-[40px] items-center space-x-2">
          <ChatSecondaryButtons />
        </div>

        <div className="bg-secondary flex max-h-[50px] min-h-[50px] w-full items-center justify-center border-b-2 font-bold">
          <div className="max-w-[200px] truncate sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
            {selectedChat?.name || "Chat"}
          </div>
        </div>

        <div
          className="flex size-full flex-col overflow-auto border-b"
          onScroll={handleScroll}
        >
          <div className="flex size-full flex-col overflow-auto border-b">
            <ChatMessages />
          </div>
          <div className="relative w-full min-w-[300px] items-end px-2 pb-3 pt-0">
            <ChatInput />
          </div>
          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      </div>
    </>
  )
}
