"use server"

import { AuthorizationUrlRequest } from "@azure/msal-node"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { calendarRequest, loginRequest, tasksRequest } from "../serverConfig"
import { authProvider } from "../services/auth"
import { getCurrentUrl } from "../utils/url"

async function acquireToken(
  request: Omit<AuthorizationUrlRequest, "redirectUri">,
  redirectPath: string
) {
  const currentUrl = new URL(getCurrentUrl())
  currentUrl.pathname = redirectPath
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

export async function login() {
  await acquireToken(loginRequest, "/protected")
  console.log("loginRequest", loginRequest)
}

export async function logout() {
  const { instance, account } = await authProvider.authenticate()

  if (account) {
    await instance.getTokenCache().removeAccount(account)
  }

  cookies().delete("__session")
  redirect("/")
}
