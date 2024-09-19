// ai.ts

import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  StreamableValue
} from "ai/rsc"
import { nanoid } from "nanoid"
import { ReactNode } from "react"
import OpenAI from "openai"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"

// Define AI State (serializable state for the server and LLM)
export type AIMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

// Define UI State (client-side state for rendering)
export type UIMessage = {
  id: string
  role: "user" | "assistant"
  display: ReactNode
}

const initialAIState: AIMessage[] = []
const initialUIState: UIMessage[] = []

export async function sendMessage(content: string): Promise<{
  aiMessage: AIMessage
  streamContent: StreamableValue<string>
}> {
  "use server"

  const aiState = getMutableAIState<typeof AI>()

  // Add the user's message to the AI state
  const userMessage: AIMessage = { id: nanoid(), role: "user", content }
  aiState.update([...aiState.get(), userMessage])

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
    stream: true
  }

  const {
    value: streamContent,
    update,
    done,
    error
  } = createStreamableValue<string>("")

  let assistantContent = ""

  ;(async () => {
    try {
      const response = await openai.chat.completions.create({
        ...params,
        messages: aiState.get().map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true
      })

      for await (const part of response) {
        const delta = part.choices[0]?.delta?.content || ""
        assistantContent += delta
        update(assistantContent)
      }

      done()

      // Add the assistant's message to the AI state
      const assistantMessage: AIMessage = {
        id: nanoid(),
        role: "assistant",
        content: assistantContent
      }
      aiState.done([...aiState.get(), assistantMessage])
    } catch (err) {
      error(err)
    }
  })()

  // Return the assistant's message and the stream
  return {
    aiMessage: {
      id: nanoid(),
      role: "assistant",
      content: "" // Content will be filled after streaming
    },
    streamContent // Return the StreamableValue directly
  }
}

// Create the AI context
export const AI = createAI<typeof initialAIState, typeof initialUIState>({
  initialAIState,
  initialUIState,
  actions: {
    sendMessage
  }
})
