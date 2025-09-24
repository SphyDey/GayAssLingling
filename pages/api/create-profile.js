// pages/api/create-profile.js
import { supabase } from "@/src/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, full_name, avatar_url, bio } = req.body;

  // get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // insert profile (trigger in DB will handle duplicates)
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id, // same as auth.uid()
        username, // slug that user wants
        full_name,
        avatar_url,
        bio,
      },
      { onConflict: "id" } // if profile exists, update instead of duplicate
    )
    .select("id, username, full_name, avatar_url, bio")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ profile: data });
      }
