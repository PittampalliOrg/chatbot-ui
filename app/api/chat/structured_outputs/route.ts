import { schemas, SchemaType } from "@/types/response-schemas"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { NextResponse } from "next/server"

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
      max_tokens:
        chatSettings.model === "gpt-4-vision-preview" ? 4096 : undefined,
      stream: true,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "openapi",
          schema: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            required: ["name", "in"],
            oneOf: [
              {
                required: ["schema"]
              },
              {
                required: ["content"]
              }
            ],
            properties: {
              name: {
                type: "string"
              },
              in: {
                type: "string",
                enum: ["query", "header", "path", "cookie"]
              },
              description: {
                type: "string"
              },
              required: {
                type: "boolean",
                default: false
              },
              deprecated: {
                type: "boolean",
                default: false
              },
              allowEmptyValue: {
                type: "boolean",
                default: false
              },
              style: {
                type: "string"
              },
              explode: {
                type: "boolean"
              },
              allowReserved: {
                type: "boolean",
                default: false
              },
              schema: {
                oneOf: [
                  {
                    $ref: "#/definitions/Schema"
                  },
                  {
                    $ref: "#/definitions/Reference"
                  }
                ]
              },
              content: {
                type: "object",
                additionalProperties: {
                  $ref: "#/definitions/MediaType"
                },
                minProperties: 1,
                maxProperties: 1
              },
              example: {},
              examples: {
                type: "object",
                additionalProperties: {
                  oneOf: [
                    {
                      $ref: "#/definitions/Example"
                    },
                    {
                      $ref: "#/definitions/Reference"
                    }
                  ]
                }
              }
            },
            patternProperties: {
              "^x-": {}
            },
            additionalProperties: false,
            definitions: {
              Schema: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "string",
                      "number",
                      "integer",
                      "boolean",
                      "array",
                      "object"
                    ]
                  },
                  format: {
                    type: "string"
                  },
                  items: {
                    $ref: "#/definitions/Schema"
                  },
                  properties: {
                    type: "object",
                    additionalProperties: {
                      $ref: "#/definitions/Schema"
                    }
                  }
                }
              },
              Reference: {
                type: "object",
                required: ["$ref"],
                properties: {
                  $ref: {
                    type: "string"
                  }
                }
              },
              MediaType: {
                type: "object",
                properties: {
                  schema: {
                    oneOf: [
                      {
                        $ref: "#/definitions/Schema"
                      },
                      {
                        $ref: "#/definitions/Reference"
                      }
                    ]
                  },
                  example: {},
                  examples: {
                    type: "object",
                    additionalProperties: {
                      oneOf: [
                        {
                          $ref: "#/definitions/Example"
                        },
                        {
                          $ref: "#/definitions/Reference"
                        }
                      ]
                    }
                  },
                  encoding: {
                    type: "object",
                    additionalProperties: {
                      $ref: "#/definitions/Encoding"
                    }
                  }
                }
              },
              Example: {
                type: "object",
                properties: {
                  summary: {
                    type: "string"
                  },
                  description: {
                    type: "string"
                  },
                  value: {},
                  externalValue: {
                    type: "string",
                    format: "uri-reference"
                  }
                }
              },
              Encoding: {
                type: "object",
                properties: {
                  contentType: {
                    type: "string"
                  },
                  headers: {
                    type: "object",
                    additionalProperties: {
                      $ref: "#/definitions/Header"
                    }
                  },
                  style: {
                    type: "string"
                  },
                  explode: {
                    type: "boolean"
                  },
                  allowReserved: {
                    type: "boolean",
                    default: false
                  }
                }
              },
              Header: {
                type: "object",
                properties: {
                  description: {
                    type: "string"
                  },
                  required: {
                    type: "boolean",
                    default: false
                  },
                  deprecated: {
                    type: "boolean",
                    default: false
                  },
                  allowEmptyValue: {
                    type: "boolean",
                    default: false
                  },
                  style: {
                    type: "string"
                  },
                  explode: {
                    type: "boolean"
                  },
                  allowReserved: {
                    type: "boolean",
                    default: false
                  },
                  schema: {
                    oneOf: [
                      {
                        $ref: "#/definitions/Schema"
                      },
                      {
                        $ref: "#/definitions/Reference"
                      }
                    ]
                  },
                  content: {
                    type: "object",
                    additionalProperties: {
                      $ref: "#/definitions/MediaType"
                    },
                    minProperties: 1,
                    maxProperties: 1
                  },
                  example: {},
                  examples: {
                    type: "object",
                    additionalProperties: {
                      oneOf: [
                        {
                          $ref: "#/definitions/Example"
                        },
                        {
                          $ref: "#/definitions/Reference"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          strict: true
        }
      }
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
  } catch (error: any) {
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
