import { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(()=> {
    supabase.auth.getSession().then(r=> {
      if (r.data.session) router.push('/dashboard');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/dashboard');
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setMsg('Check your email to confirm your account.');
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else router.push('/dashboard');
  };

  return (
    <main className='min-h-screen flex items-center justify-center p-6'>
      <div className='max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4'>Sign up / Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='w-full mb-2 p-2 border' />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' type='password' className='w-full mb-2 p-2 border' />
        <div className='flex space-x-2'>
          <button onClick={signUp} className='px-3 py-2 bg-black text-white rounded'>Sign up</button>
          <button onClick={signIn} className='px-3 py-2 border rounded'>Sign in</button>
        </div>
        {msg && <p className='mt-3 text-sm'>{msg}</p>}
      </div>
    </main>
  );
}
