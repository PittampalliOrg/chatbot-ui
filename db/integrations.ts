// db/integrations.ts

import { supabase } from "@/lib/supabase/browser-client"
import { Tables } from "@/supabase/types"

export const getIntegrations = async () => {
  const { data: integrations, error } = await supabase
    .from("integrations")
    .select("*")

  if (!integrations) {
    throw new Error(error.message)
  }

  return integrations
}

export const updateIntegrationActive = async (id: string) => {
  const { data, error } = await supabase
    .from("integrations")
    .update({ active: true })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const updateIntegrationInactive = async (id: string) => {
  const { data, error } = await supabase
    .from("integrations")
    .update({ active: false })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}
