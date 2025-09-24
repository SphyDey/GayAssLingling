import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabaseClient';
import Link from 'next/link';
import AvatarUploader from '../components/AvatarUploader';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle().then(({ data }) => {
      setProfile(data);
      setSlug(data?.slug || '');
    });
  }, [session]);

  const saveSlug = async () => {
    if (!slug) return;
    const { error, data } = await supabase.from('profiles').update({ slug }).eq('id', profile.id).select().maybeSingle();
    if (error) {
      if (error.code === '23505') alert('Slug taken, choose another.');
      else alert(error.message);
    } else {
      setProfile(data);
    }
  };

  if (!session) return <div className='p-4'>Please login.</div>;
  if (!profile) return <div className='p-4'>Loading profile...</div>;

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <div className='mb-4'>
        <label className='block font-medium'>Custom URL</label>
        <div className='flex items-center space-x-2'>
          <span className='text-gray-600'>yourdomain.com/</span>
          <input value={slug} onChange={e=>setSlug(e.target.value.toLowerCase())} className='border rounded px-2 py-1'/>
        </div>
        <button onClick={saveSlug} className='mt-2 px-3 py-1 bg-blue-600 text-white rounded'>Save URL</button>
        {profile.slug && <div className='mt-1 text-sm'>Public page: <Link href={`/${profile.slug}`}><a className='text-blue-600'>/{profile.slug}</a></Link></div>}
      </div>
      <AvatarUploader profile={profile} onUploaded={async (u)=>{
        await supabase.from('profiles').update({ avatar_path: u.publicUrl }).eq('id', profile.id);
        const { data } = await supabase.from('profiles').select('*').eq('id', profile.id).maybeSingle();
        setProfile(data);
      }} />
      <TemplateList profile={profile} onProfileUpdated={setProfile} />
    </div>
  );
}

function TemplateList({ profile, onProfileUpdated }) {
  const templates = [
    { id:'minimal', title:'Minimal', settings:{ theme:'minimal', colors:{ bg:'#fff', accent:'#111827'}, font:'Inter'} },
    { id:'dark', title:'Dark', settings:{ theme:'dark', colors:{ bg:'#0f172a', accent:'#f97316'}, font:'Inter'} },
    { id:'pastel', title:'Pastel', settings:{ theme:'pastel', colors:{ bg:'#fff7ed', accent:'#7c3aed'}, font:'Inter'} }
  ];
  const apply = async (tpl)=>{
    await supabase.from('profiles').update({ settings: tpl.settings }).eq('id', profile.id);
    const { data } = await supabase.from('profiles').select('*').eq('id', profile.id).maybeSingle();
    onProfileUpdated(data);
  };
  return (
    <div className='mt-6'>
      <h3 className='font-semibold mb-2'>Templates</h3>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {templates.map(t=>(
          <div key={t.id} className='p-3 border rounded'>
            <div className='font-medium'>{t.title}</div>
            <button onClick={()=>apply(t)} className='mt-2 px-2 py-1 bg-black text-white rounded text-sm'>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}
