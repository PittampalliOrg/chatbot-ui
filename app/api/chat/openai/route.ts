import { schemas, SchemaType } from "@/types/response-schemas"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { NextResponse } from "next/server"

type Parameter = {
  name: string
  in: string
  description: string
  required: boolean
}

type ToolCallDefinition = {
  type: "function"
  function: {
    name: string
    description: string
    parameters: {
      type: "object"
      properties: Record<
        string,
        { type: string; description: string; enum?: string[] }
      >
      required: string[]
      additionalProperties: false
    }
  }
}

function createToolCallDefinition(
  functionName: string,
  functionDescription: string,
  parameters: Parameter[]
): ToolCallDefinition {
  const properties: Record<string, { type: string; description: string }> = {}
  const required: string[] = []

  parameters.forEach(param => {
    properties[param.name] = {
      type: "string", // Assuming all parameters are strings. Adjust if necessary.
      description: param.description
    }

    if (param.required) {
      required.push(param.name)
    }
  })

  return {
    type: "function",
    function: {
      name: functionName,
      description: functionDescription,
      parameters: {
        type: "object",
        properties: properties,
        required: required,
        additionalProperties: false
      }
    }
  }
}

// Define the expected response format for the structured output
type ParameterResponse = {
  parameters: Parameter[]
}

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, schemaType } = json as {
    chatSettings: ChatSettings
    messages: any[]
    schemaType: SchemaType
  }

  try {
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
      max_tokens: chatSettings.model === "gpt-4-vision-preview" ? 4096 : null, // TODO: Fix
      stream: false,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "parameters_response",
          schema: {
            type: "object",
            properties: {
              parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the parameter"
                    },
                    in: {
                      type: "string",
                      description:
                        "The location of the parameter, e.g., query, header, path",
                      enum: ["query", "header", "path", "cookie"]
                    },
                    description: {
                      type: "string",
                      description: "A brief description of the parameter"
                    },
                    required: {
                      type: "boolean",
                      description:
                        "Indicates whether this parameter is required"
                    }
                  },
                  required: ["name", "in", "description", "required"],
                  additionalProperties: false
                },
                description: "An array containing one or more parameter objects"
              }
            },
            required: ["parameters"],
            additionalProperties: false
          },
          strict: true
        }
      }
    })

    // Step 3: Handle edge cases like incomplete responses or refusals
    const completion = response.choices[0]
    if (completion.finish_reason === "length") {
      throw new Error("Incomplete response")
    }

    if (completion.message?.refusal) {
      throw new Error(`Model refusal: ${completion.message.refusal}`)
    }

    if (!completion.message?.content) {
      throw new Error("No response content")
    }

    // Step 4: Type-safe parsing of the response
    const parsedResponse = JSON.parse(
      completion.message.content
    ) as ParameterResponse

    // Check if parameters exist
    if (!parsedResponse || !parsedResponse.parameters) {
      throw new Error("Invalid response format")
    }

    // Use the parsed response to create a tool call definition
    const toolDefinition = createToolCallDefinition(
      "api_tool_function",
      "Generated API tool function based on parameters",
      parsedResponse.parameters
    )

    // Return the generated tool call definition to the user
    return new Response(JSON.stringify(toolDefinition), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    // Handle edge cases and errors
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
