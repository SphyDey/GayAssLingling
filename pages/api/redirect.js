import { createClient } from '@supabase/supabase-js';
import UAParser from 'ua-parser-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { linkId } = req.query;
  if (!linkId) return res.status(400).send('Missing linkId');
  const { data: link } = await supabase.from('links').select('*').eq('id', linkId).maybeSingle();
  if (!link) return res.status(404).send('Not found');

  // parse UA
  const ua = req.headers['user-agent'] || '';
  const parser = new UAParser(ua);
  const device = parser.getDevice().type || 'desktop';
  const ref = req.headers.referer || null;
  const refDomain = ref ? (()=>{ try { return new URL(ref).hostname } catch { return null } })() : null;

  await supabase.from('link_clicks').insert({
    link_id: link.id,
    profile_id: link.profile_id,
    user_agent: ua,
    device_type: device,
    referrer_domain: refDomain,
    ip: req.headers['x-forwarded-for'] || null
  });

  res.writeHead(302, { Location: link.url });
  res.end();
}
