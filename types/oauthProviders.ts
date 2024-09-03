import { Tables } from "../supabase/types"

// Define the OauthProvider type that extends the integrations table
export type OauthProvider = Tables<"integrations"> & {
  active: boolean
}
