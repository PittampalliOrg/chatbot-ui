import { NextResponse } from "next/server"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"

const modelName = "GPT-4o 2024"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const client = new OpenAI()

  const response = await client.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "user",
        content: `Recipe for ${prompt || "chocolate brownies"}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "math_response",
        schema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  explanation: { type: "string" },
                  output: { type: "string" }
                },
                required: ["explanation", "output"],
                additionalProperties: false
              }
            },
            final_answer: { type: "string" }
          },
          required: ["steps", "final_answer"],
          additionalProperties: false
        },
        strict: true
      }
    },
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
