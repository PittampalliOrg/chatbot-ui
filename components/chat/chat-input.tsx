// ChatInput.tsx

"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { useActions, useUIState } from "ai/rsc"
import { nanoid } from "nanoid"
import TextareaAutosize from "react-textarea-autosize"
import {
  IconSend,
  IconPlayerStopFilled,
  IconCirclePlus
} from "@tabler/icons-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { UserMessage } from "@/components/chat/UserMessage"
import { AssistantMessage } from "@/components/chat/AssistantMessage"
import { ChatbotUIContext } from "@/context/context"
import { UIMessage } from "@/app/ai"
import { StreamableValue } from "ai/rsc"

export const ChatInput: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState("")
  const { sendMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const { isGenerating, setIsGenerating } = useContext(ChatbotUIContext)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = input.trim()
    setInput("")
    if (!value) return

    // Optimistically add user message to UI state
    const userMessage: UIMessage = {
      id: nanoid(),
      role: "user",
      display: <UserMessage>{value}</UserMessage>
    }
    setMessages([...messages, userMessage])
    console.log("After adding user message:", messages)

    setIsGenerating(true)

    // Call the server action
    const { aiMessage } = await sendMessage(value)

    // Add assistant message to UI state
    const assistantMessage: UIMessage = {
      id: aiMessage.id,
      role: "assistant",
      display: <AssistantMessage content={aiMessage.content} />
    }
    setMessages((prevMessages: UIMessage[]) => {
      const newMessages = [...prevMessages, assistantMessage]
      console.log("After adding assistant message:", newMessages)
      return newMessages
    })

    setIsGenerating(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    // Handle file upload logic
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative flex items-center">
        {/* File upload button */}
        <IconCirclePlus
          className="absolute left-3 cursor-pointer p-1 hover:opacity-50"
          size={32}
          onClick={() => fileInputRef.current?.click()}
        />

        {/* Hidden input to select files from device */}
        <Input
          ref={fileInputRef}
          className="hidden"
          type="file"
          onChange={handleFileUpload}
        />

        <TextareaAutosize
          placeholder="Ask anything. Type @ / # !"
          className="w-full resize-none bg-transparent px-14 py-2"
          autoFocus={true}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
        />

        <div className="absolute right-3">
          {isGenerating ? (
            <IconPlayerStopFilled
              size={30}
              onClick={() => {
                // Handle stop generating logic if needed
              }}
            />
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={input === "" || isGenerating}
            >
              <IconSend size={30} />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
