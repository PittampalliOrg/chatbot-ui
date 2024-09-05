// app/api/protected/route.ts
"use server"

import { NextRequest, NextResponse } from "next/server"
import { validateAccessToken } from "./authMiddleware"
import { validateScope } from "./scopeMiddleware"
import {
  ConfidentialClientApplication,
  OnBehalfOfRequest
} from "@azure/msal-node"
import { Client } from "@microsoft/microsoft-graph-client"
import "isomorphic-fetch"
import { msalConfig } from "./providerAuthConfig"

const cca = new ConfidentialClientApplication({ auth: msalConfig.auth })

export async function GET(req: NextRequest) {
  try {
    const user = await validateAccessToken(req)

    if (!validateScope(["access_as_user"])(user)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = authHeader.split(" ")[1]

    // Make an on-behalf-of request for Microsoft Graph
    const oboRequest: OnBehalfOfRequest = {
      oboAssertion: accessToken,
      scopes: ["https://graph.microsoft.com/.default"]
    }

    const response = await cca.acquireTokenOnBehalfOf(oboRequest)
    console.log(`OBO Token: ${response?.accessToken}`)

    // Initialize Graph Client
    const graphClient = Client.init({
      authProvider: done => {
        done(null, response?.accessToken ?? null)
      }
    })

    // Send an email on behalf of the user
    await graphClient.api("/me/sendMail").post({
      message: {
        subject: "Email from a protected API",
        body: {
          contentType: "Text",
          content:
            "This is a demo email from a protected API sent on-behalf-of a user."
        },
        toRecipients: [
          {
            emailAddress: {
              address: "vinod@pittampalli.com"
            }
          }
        ]
      }
    })

    return NextResponse.json({
      result: `Hello ${user.name}, you have access to this protected resource! And the API just sent an e-mail on your behalf!`
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error sending email" }, { status: 500 })
  }
}
