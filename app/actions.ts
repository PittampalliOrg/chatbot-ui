"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Database } from "@/supabase/types"
import { createClient } from "@/lib/supabase/server"
import { type Chat } from "@/lib/types"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export async function getChats(userId?: string | null) {
  const supabase = createClient()

  try {
    const { data: chats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return chats as Chat[]
  } catch (error) {
    console.error("Error fetching chats:", error)
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const supabase = createClient()

  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error || !chat) {
    return null
  }

  return chat as Chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const supabase = createClient()

  const { error } = await supabase.from("chats").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to remove chat")
  }

  revalidatePath("/")
  return revalidatePath(path)
}

export async function clearChats(userId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("chats").delete().eq("user_id", userId)

  if (error) {
    throw new Error("Failed to clear chats")
  }

  revalidatePath("/")
  return redirect("/")
}

export async function getSharedChat(id: string) {
  const supabase = createClient()

  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .eq("sharing", "public")
    .single()

  if (error || !chat) {
    return null
  }

  return chat as Chat
}

export async function shareChat(id: string) {
  const supabase = createClient()

  const { data: chat, error } = await supabase
    .from("chats")
    .update({ sharing: "public" })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error("Failed to share chat")
  }

  return chat as Chat
}

export async function saveChat(chat: TablesInsert<"chats">) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chats")
    .upsert(chat)
    .select()
    .single()

  if (error) {
    throw new Error("Failed to save chat")
  }

  return data as Chat
}

export async function updateChat(id: string, updates: TablesUpdate<"chats">) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chats")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error("Failed to update chat")
  }

  return data as Chat
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ["OPENAI_API_KEY"]
  return keysRequired
    .map(key => (process.env[key] ? "" : key))
    .filter(key => key !== "")
}
