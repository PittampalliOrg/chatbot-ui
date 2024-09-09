"use server"

import { AuthorizationUrlRequest } from "@azure/msal-node"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { calendarRequest, loginRequest, tasksRequest } from "../serverConfig"
import { authProvider } from "../services/auth"
import { getCurrentUrl } from "../utils/url"
import { createClient } from "@/lib/supabase/server"

async function acquireToken(
  request: Omit<AuthorizationUrlRequest, "redirectUri">,
  redirectPath: string
) {
  const currentUrl = new URL(getCurrentUrl())
  const redirectUrl = currentUrl.toString()

  console.log("request", request)
  console.log("redirectUrl", redirectUrl)
  redirect(await authProvider.getAuthCodeUrl(request, redirectUrl))
}

export async function acquireCalendarTokenInteractive() {
  await acquireToken(calendarRequest, "/protected/event")
}

export async function acquireTasksTokenInteractive() {
  await acquireToken(tasksRequest, "/protected/tasks")
}

async function redirectToHome(): Promise<string> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()

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

export async function login() {
  await acquireToken(loginRequest, "/protected")
  console.log("loginRequest", loginRequest)
  const redirectPath = await redirectToHome()
  redirect(redirectPath)
}

export async function logout() {
  const { instance, account } = await authProvider.authenticate()

  if (account) {
    await instance.getTokenCache().removeAccount(account)
  }

  cookies().delete("__session")
  const redirectPath = await redirectToHome()
  redirect(redirectPath)
}
