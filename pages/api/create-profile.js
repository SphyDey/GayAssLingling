import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { user_id, display_name, slug } = req.body;
  if (!user_id || !slug) return res.status(400).json({ error: 'Missing' });
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0,30);
  try {
    const { data, error } = await supabase.from('profiles').insert({
      user_id, display_name, slug: clean
    }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ profile: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
