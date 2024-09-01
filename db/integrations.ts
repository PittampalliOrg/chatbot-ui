// db/integrations.ts

import { supabase } from "@/lib/supabase/browser-client"
import { Tables } from "@/supabase/types"

export const updateIntegration = async (
  integrationId: string,
  updates: Partial<Tables<"integrations">>
): Promise<Tables<"integrations">> => {
  const { data, error } = await supabase
    .from("integrations")
    .update(updates)
    .eq("id", integrationId)
    .select("*")
    .single()

  if (error) {
    console.error("Error updating integration:", error)
    throw error
  }

  return data
}
