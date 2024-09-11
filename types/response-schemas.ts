import { jsonSchema } from "ai"

export const emailSchema = jsonSchema<{
  email: {
    to: string
    subject: string
    body: string
  }
}>({
  type: "object",
  properties: {
    email: {
      type: "object",
      properties: {
        to: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" }
      },
      required: ["to", "subject", "body"]
    }
  },
  required: ["email"]
})

export const recipeSchema = jsonSchema<{
  recipe: {
    name: string
    ingredients: { quantity: string; ingredient: string }[]
    steps: string[]
  }
}>({
  type: "object",
  properties: {
    recipe: {
      type: "object",
      properties: {
        name: { type: "string" },
        ingredients: {
          type: "array",
          items: {
            type: "object",
            properties: {
              quantity: { type: "string" },
              ingredient: { type: "string" }
            },
            required: ["quantity", "ingredient"]
          }
        },
        steps: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["name", "ingredients", "steps"]
    }
  },
  required: ["recipe"]
})

export const schemas = {
  email: emailSchema,
  recipe: recipeSchema
}

export type SchemaType = keyof typeof schemas
