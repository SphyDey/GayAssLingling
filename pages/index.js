import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen flex items-center justify-center p-6'>
      <div className='max-w-xl w-full'>
        <h1 className='text-3xl font-bold mb-4'>Linktree Clone — Full Starter</h1>
        <p className='mb-6'>Sign up, create a profile, add links, and share a vanity URL.</p>
        <div className='space-x-3'>
          <Link href='/auth'><a className='px-4 py-2 bg-black text-white rounded'>Sign Up / Login</a></Link>
          <Link href='/dashboard'><a className='px-4 py-2 border rounded'>Dashboard</a></Link>
        </div>
        <div className='mt-8 text-sm text-gray-600'>Public profiles: <code>/&lt;slug&gt;</code></div>
      </div>
    </main>
  );
}
