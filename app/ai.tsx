import { createAI, getAIState } from "ai/rsc"
import { nanoid } from "nanoid"
import { createClient } from "@/lib/supabase/server"

// Define Chat and Message types
interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface Chat {
  id: string
  user_id: string
  workspace_id: string
  assistant_id: string | null
  folder_id: string | null
  created_at: string
  updated_at: string | null
  sharing: string
  context_length: number
  embeddings_provider: string
  include_profile_context: boolean
  include_workspace_instructions: boolean
  model: string
  name: string
  prompt: string
  temperature: number
  messages: Message[]
}

// Define AIState and UIState
interface AIState {
  chatId: string
  messages: Message[]
}

interface UIState {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

// Implement submitUserMessage function
async function submitUserMessage(message: string): Promise<Message> {
  // This is a placeholder implementation. Replace with actual logic.
  return {
    role: "assistant",
    content: `You said: ${message}. This is a placeholder response.`
  }
}

// Implement confirmPurchase function
async function confirmPurchase(
  symbol: string,
  amount: number
): Promise<boolean> {
  // This is a placeholder implementation. Replace with actual logic.
  console.log(`Confirming purchase of ${amount} ${symbol}`)
  return true
}

// Implement getUIStateFromAIState function
function getUIStateFromAIState(aiState: Chat): UIState[] {
  return aiState.messages.map(message => ({
    id: nanoid(),
    role: message.role,
    content: message.content
  }))
}

// Implement getWorkspaceId function
async function getWorkspaceId(userId: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("workspaces")
    .select("id")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching workspace_id:", error)
    throw new Error("Failed to fetch workspace_id")
  }

  return data.id
}

export const AI = createAI<AIState, UIState[]>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    "use server"

    const supabase = createClient()
    const session = await supabase.auth.getSession()

    if (session && session.data.session?.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    }
    return []
  },
  onSetAIState: async ({ state }) => {
    "use server"

    const supabase = createClient()
    const session = await supabase.auth.getSession()

    if (session && session.data.session?.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.data.session.user.id
      const workspaceId = await getWorkspaceId(userId)

      const firstMessageContent = messages[0]?.content || ""
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        user_id: userId,
        workspace_id: workspaceId,
        assistant_id: null,
        folder_id: null,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
        sharing: "private",
        context_length: 4096,
        embeddings_provider: "openai",
        include_profile_context: false,
        include_workspace_instructions: false,
        model: "gpt-3.5-turbo",
        name: title,
        prompt: "",
        temperature: 0.7,
        messages: messages
      }

      const { data, error } = await supabase
        .from("chats")
        .upsert(chat)
        .select()
        .single()

      if (error) {
        console.error("Error saving chat:", error)
        return
      }

      // Save messages
      const messagesToSave = messages.map((message, index) => ({
        chat_id: data.id,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        content: message.content,
        image_paths: [],
        model: chat.model,
        role: message.role,
        sequence_number: index + 1,
        assistant_id: null
      }))

      const { error: messagesError } = await supabase
        .from("messages")
        .insert(messagesToSave)

      if (messagesError) {
        console.error("Error saving messages:", messagesError)
      }
    }
  }
})
