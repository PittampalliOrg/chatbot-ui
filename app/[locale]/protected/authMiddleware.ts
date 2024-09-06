// app/lib/authMiddleware.ts

import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import { msalConfig, tokenValidationConfig } from "./providerAuthConfig"

const client = jwksClient({
  jwksUri: `${msalConfig.auth.authority}/discovery/v2.0/keys`
})

const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, (err: any, key: any) => {
    if (err) {
      callback(err, null)
    } else {
      const signingKey = key.getPublicKey()
      callback(null, signingKey)
    }
  })
}

export const validateAccessToken = (req: NextRequest): Promise<any> => {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reject("Unauthorized")
    }

    const token = authHeader!.split(" ")[1]

    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["RS256"],
        issuer: tokenValidationConfig.issuer,
        audience: tokenValidationConfig.audience
      },
      (err, decoded) => {
        if (err) {
          reject("Unauthorized")
        }
        resolve(decoded)
      }
    )
  })
}
