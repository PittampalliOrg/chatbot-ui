// https://nextjs.org/docs/getting-started/react-essentials#the-server-only-package
// importing server-only as this module contains secrets that should not be exposed to the client
import { Configuration, LogLevel } from "@azure/msal-node"
import "server-only"


// Define the API URL based on the environment (production or local)
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://chatbot-ui-livid-mu.vercel.app' 
  : 'http://localhost:3000';

export const graphConfig = {
  graphEndpoint: "https://graph.microsoft.com/v1.0",
  meEndpoint: "https://graph.microsoft.com/v1.0/me",
  eventEndpoint: "https://graph.microsoft.com/v1.0/me/calendar/events?$top=1",
  profilePhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  mailEndpoint: "https://graph.microsoft.com/v1.0/me/messages?$top=5"
}

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    authority:
      process.env.AZURE_AD_AUTHORITY ??
      "https://login.microsoftonline.com/common"
  },
  system: {
    loggerOptions: {
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
      loggerCallback(logLevel, message) {
        switch (logLevel) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
          default:
            console.log(message)
            return
        }
      }
    }
  }
}

export const loginRequest = {
  scopes: ["User.Read"]
}

export const calendarRequest = {
  scopes: ["Calendars.Read"]
}

export const tasksRequest = {
  scopes: ["Tasks.Read"]
}

export const authCallbackUri =
  process.env.AUTH_CALLBACK_URI ?? `${apiUrl}/api/protected/proxy`

export const sessionSecret = process.env.SESSION_SECRET!

// redis[s]://[[username][:password]@][host][:port][/db-number]
// if undefined it will connect to a local redis server
export const redisUrl = process.env.REDIS_REDIS_URL
