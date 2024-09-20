import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { NextResponse } from "next/server"
// export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  const profile = await getServerProfile()

  checkApiKey(profile.openai_api_key, "OpenAI")

  const openai = new OpenAI({
    apiKey: profile.openai_api_key || "",
    organization: profile.openai_organization_id
  })

  const response = await openai.chat.completions.create({
    model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
    messages: messages as ChatCompletionCreateParamsBase["messages"],
    temperature: chatSettings.temperature,
    max_tokens:
      chatSettings.model === "gpt-4-vision-preview" ||
      chatSettings.model === "gpt-4o-2024-08-06"
        ? 4096
        : null, // TODO: Fix
    stream: true
  })

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ""
        controller.enqueue(new TextEncoder().encode(content))
      }
      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked"
    }
  })
}
