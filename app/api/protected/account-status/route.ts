import { NextResponse } from "next/server"
import { authProvider } from "@/app/[locale]/protected/services/auth"

export async function GET() {
  try {
    const account = await authProvider.getAccount()
    return NextResponse.json({ isSignedIn: !!account })
  } catch (error) {
    console.error("Error checking account status:", error)
    return NextResponse.json({ isSignedIn: false }, { status: 500 })
  }
}
