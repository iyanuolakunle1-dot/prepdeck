import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars are missing. Copy client/.env.example to client/.env and fill in your project URL and anon key.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// A blanket 401 on every request (auth working, but every table read/write
// rejected) almost always means the anon key or URL in client/.env doesn't
// match the Supabase project — not a data or RLS problem. This turns that
// silent, confusing failure into a specific, actionable toast instead of
// just a red line in the console.
let warned401 = false;
export function notifySupabaseError(error, context = 'load your data') {
  console.error(`Supabase error (${context}):`, error);
  const status = error?.status || error?.code;
  if ((status === 401 || status === '401') && !warned401) {
    warned401 = true;
    toast.error(
      "Can't connect to your account data (401). Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env exactly match your Supabase project's Settings → API values, then restart the dev server.",
      { duration: 8000 }
    );
  } else if (status !== 401) {
    toast.error(`Couldn't ${context}. Please try again.`);
  }
}
