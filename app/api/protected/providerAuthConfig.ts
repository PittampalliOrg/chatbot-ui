// app/lib/authConfig.ts

export const msalConfig = {
  auth: {
    clientId: "68865588-d66d-4db6-8680-0ad4369fdf5b",
    authority:
      "https://login.microsoftonline.com/0c4da9c5-40ea-4e7d-9c7a-e7308d4f8e38",
    clientSecret: process.env.AUTH_PROVIDER_MICROSOFT_ENTRA_SECRET
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: any, message: any, containsPii: any) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: "Verbose"
    }
  }
}

export const tokenValidationConfig = {
  issuer:
    "https://login.microsoftonline.com/0c4da9c5-40ea-4e7d-9c7a-e7308d4f8e38/v2.0",
  audience: "68865588-d66d-4db6-8680-0ad4369fdf5b"
}
