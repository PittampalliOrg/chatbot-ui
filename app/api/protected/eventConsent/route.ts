import { NextRequest, NextResponse } from "next/server"
import { calendarRequest } from "@/app/[locale]/protected/serverConfig"
import { authProvider } from "@/app/[locale]/protected/services/auth"

export async function POST(request: NextRequest) {
  const returnTo = new URL("/api/protected/event", request.url).toString()

  return NextResponse.redirect(
    await authProvider.getAuthCodeUrl(calendarRequest, returnTo),
    {
      status: 303
    }
  )
}
