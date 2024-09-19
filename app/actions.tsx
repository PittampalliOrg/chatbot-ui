// actions.tsx

"use server"

import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  StreamableValue
} from "ai/rsc"
import OpenAI from "openai"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { nanoid } from "nanoid"
import React, { ReactNode } from "react"

// Import AssistantMessage from its own file
import { AssistantMessage } from "@/components/chat/AssistantMessage"
import { UserMessage } from "@/components/chat/UserMessage"

// Define the AI state type
export type AIState = {
  chatId: string
  messages: any[]
}

// Define the UI state type
export type UIState = {
  id: string
  display: React.ReactNode
}[]

// The submitUserMessage server action
export async function submitUserMessage(content: string) {
  "use server"

  const aiState = getMutableAIState<typeof AI>()

  // Update the AI state with the user's message
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content
      }
    ]
  })

  // Get the OpenAI API key and check it
  const profile = await getServerProfile()

  checkApiKey(profile.openai_api_key, "OpenAI")

  const openai = new OpenAI({
    apiKey: profile.openai_api_key || "",
    organization: profile.openai_organization_id
  })

  // Define default chat settings or obtain them from somewhere
  // const chatSettings: ChatSettings = {
  //   model: 'gpt-3.5-turbo', // or your preferred model
  //   temperature: 0.7,
  //   // Add other settings as needed
  // };

  const params = {
    model: "gpt-4o-2024-08-06", // chatSettings.model as OpenAI.Chat.Completions.ChatCompletionCreateParams['model'],
    temperature: 0.7, // chatSettings.temperature,
    max_tokens: null, // Adjust as needed
    stream: true
  }

  const textStream = createStreamableValue<string>("")
  const textNode = <AssistantMessage content={textStream.value} />

  ;(async () => {
    try {
      const response = await openai.chat.completions.create({
        ...params,
        messages: aiState.get().messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true
      })

      let assistantContent = ""

      for await (const part of response) {
        const delta = part.choices[0]?.delta?.content || ""
        assistantContent += delta
        textStream.update(assistantContent)
      }

      textStream.done()

      // Update AI state when done
      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: "assistant",
            content: assistantContent
          }
        ]
      })
    } catch (error) {
      textStream.error(error)
    }
  })()
  console.log("textNode:", textNode)
  return {
    id: nanoid(),
    display: textNode
  }
}

// Create the AI instance
export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onSetAIState: async ({ state }) => {
    "use server"
    // Optionally, save the AI state here
  }
})
