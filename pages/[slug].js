import { supabase } from '../src/lib/supabaseClient';

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  const { data: profile } = await supabase.from('profiles').select('*, links(*)').eq('slug', slug).maybeSingle();
  if (!profile) return { notFound: true };
  return { props: { profile } };
}

export default function ProfilePage({ profile }) {
  const bg = profile.settings?.colors?.bg || '#fff';
  const accent = profile.settings?.colors?.accent || '#111827';
  return (
    <div style={{ backgroundColor:bg, fontFamily:profile.settings?.font||'Inter'}} className='min-h-screen flex flex-col items-center p-6'>
      {profile.avatar_path && <img src={profile.avatar_path} className='w-24 h-24 rounded-full mb-4'/>}
      <h1 className='text-2xl font-bold mb-2'>{profile.username||profile.slug}</h1>
      <p className='text-gray-600 mb-6'>{profile.bio}</p>
      <div className='w-full max-w-sm space-y-3'>
        {profile.links?.map(link=>(
          <a key={link.id} href={`/api/redirect/${link.id}`} style={{backgroundColor:accent}} className='block text-center text-white py-3 rounded-xl shadow'>
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}
