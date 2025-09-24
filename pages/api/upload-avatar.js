import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Invalid upload' });
    const file = files.avatar;
    const buf = fs.readFileSync(file.filepath);
    const filename = `avatars/${Date.now()}-${file.originalFilename}`;
    const { data, error: upErr } = await supabase.storage.from('avatars').upload(filename, buf, { contentType: file.mimetype });
    if (upErr) return res.status(500).json({ error: upErr.message });
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace('/','')}/storage/v1/object/public/avatars/${filename}`; // adjust as needed
    return res.json({ path: data.path, publicUrl });
  });
}
