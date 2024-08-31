export type OauthProvider = {
  provider: "microsoft" | "google"
  scopes?: string[]
  active: boolean
}
