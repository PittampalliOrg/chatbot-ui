"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function redirectToHome(): Promise<string> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_home", true)
        .single()

      if (error) throw error

      if (homeWorkspace) {
        return `/${homeWorkspace.id}/chat`
      }
    }

    // If no session or no home workspace, return default chat page
    return "/chat"
  } catch (error) {
    console.error("Error in home redirect:", error)
    return "/chat" // Fallback to default chat page on error
  }
}