import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
"https://bzikbbqsxrjlyfyvoasf.supabase.co";

const supabaseKey =
"sb_publishable_ZGZw0nTKBA-SBqn1EsWD7Q_3TFhgnQd";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);