// app/api/google/[...route]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { EnrichedSession } from "@/auth"
import { google } from "googleapis"

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const session = (await auth()) as EnrichedSession | null

  if (!session || !session.providers || !session.providers["google"]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { accessToken, refreshToken } = session.providers["google"]

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  try {
    let result

    switch (params.route[0]) {
      case "profile":
        const people = google.people({ version: "v1", auth: oauth2Client })
        result = await people.people.get({
          resourceName: "people/me",
          personFields: "names,emailAddresses,photos"
        })
        break
      case "calendar":
        const calendar = google.calendar({ version: "v3", auth: oauth2Client })
        result = await calendar.events.list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime"
        })
        break
      // Add more cases for different API endpoints as needed
      default:
        return NextResponse.json({ error: "Invalid route" }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error calling Google API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = (await auth()) as EnrichedSession | null

  if (!session || !session.providers || !session.providers["google"]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { accessToken, refreshToken } = session.providers["google"]

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  try {
    const body = await request.json()

    // Example: Create a calendar event
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })
    const result = await calendar.events.insert({
      calendarId: "primary",
      requestBody: body
    })

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error calling Google API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
