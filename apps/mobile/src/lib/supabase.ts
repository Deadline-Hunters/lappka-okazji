import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

import { sessionStorage } from "./session-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

export const authStorageKey = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: authStorageKey,
    storage: sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
