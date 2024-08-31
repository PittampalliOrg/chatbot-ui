import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"
import { auth } from "./auth"
import { EnrichedSession } from "./auth"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  try {
    const session = await auth() as EnrichedSession | null
    const { supabase, response } = createClient(request)

    const supabaseSession = await supabase.auth.getSession()

    const isAuthenticated = session || supabaseSession.data.session
    const redirectToChat = isAuthenticated && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      let userId = session?.user?.id || supabaseSession.data.session?.user.id

      if (!userId) {
        throw new Error("User ID not found in session")
      }

      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", userId)
        .eq("is_home", true)
        .single()

      if (!homeWorkspace) {
        throw new Error(error?.message || "Home workspace not found")
      }

      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      )
    }

    if (session && session.providers) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-auth-provider', Object.keys(session.providers).join(','))
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return response
  } catch (e) {
    console.error("Middleware error:", e)
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}