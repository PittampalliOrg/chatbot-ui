import { Tables } from "@/supabase/types"
import { Table } from "lucide-react"

export type DataListType =
  | Tables<"collections">[]
  | Tables<"chats">[]
  | Tables<"presets">[]
  | Tables<"prompts">[]
  | Tables<"files">[]
  | Tables<"assistants">[]
  | Tables<"tools">[]
  | Tables<"models">[]
  | Tables<"integrations">[]

export type DataItemType =
  | Tables<"collections">
  | Tables<"chats">
  | Tables<"presets">
  | Tables<"prompts">
  | Tables<"files">
  | Tables<"assistants">
  | Tables<"tools">
  | Tables<"models">
  | Tables<"integrations">
