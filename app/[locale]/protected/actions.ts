"use server"

import { prepScopes, Providers } from "@microsoft/mgt-element"

export async function sendMailAction() {
  let provider = Providers.globalProvider
  if (provider) {
    let graphClient = provider.graph.client
    await graphClient
      .api("https://localhost:3000/api/protected/callback")
      .middlewareOptions(
        prepScopes([
          "api://68865588-d66d-4db6-8680-0ad4369fdf5b/access_as_user"
        ])
      )
      .post({
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
  }
}
