import { NextRequest, NextResponse } from "next/server"
import { authProvider } from "@/app/[locale]/protected/services/auth"
import {
  commitSession,
  getSession
} from "@/app/[locale]/protected/services/session"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { account, returnTo } = await authProvider.handleAuthCodeCallback(
      await request.formData()
    )

    if (!account) {
      throw new Error("No account found")
    }

    const session = await getSession(request.headers.get("Cookie"))

    session.set("homeAccountId", account.homeAccountId)

    // Get the locale from the request URL
    const locale = request.nextUrl.pathname.split("/")[1]

    // Set a default returnTo URL if it's not provided
    const defaultReturnTo = new URL(
      `/${locale}/protected`,
      request.url
    ).toString()
    const safeReturnTo =
      returnTo && returnTo !== "" ? returnTo : defaultReturnTo

    // Ensure the returnTo URL is absolute
    const redirectUrl = new URL(safeReturnTo, request.url).toString()

    return NextResponse.redirect(redirectUrl, {
      status: 303,
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    })
  } catch (error) {
    console.error(error)
    // Handle the error case
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
