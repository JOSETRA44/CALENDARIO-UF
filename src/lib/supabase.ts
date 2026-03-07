import { createClient } from '@supabase/supabase-js';

// During `next build` the module is evaluated server-side even for 'use client' files.
// Using fallback strings avoids a build-time crash; actual values must be set at build time
// via env vars so that the browser bundle contains the real credentials.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(url, key);
