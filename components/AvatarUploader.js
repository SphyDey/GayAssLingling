import { useState } from 'react';
import { supabase } from '../src/lib/supabaseClient';

export default function AvatarUploader({ profile, onUploaded }) {
  const [preview, setPreview] = useState(profile?.avatar_path || '');
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${profile?.id || 'anon'}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file);
    setUploading(false);
    if (error) {
      alert('Upload failed: ' + error.message);
      return;
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;
    onUploaded && onUploaded({ path: filePath, publicUrl });
  };

  return (
    <div className='flex items-center space-x-4'>
      <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center'>
        {preview ? <img src={preview} alt='avatar' className='w-full h-full object-cover' /> : <span>No</span>}
      </div>
      <input type='file' accept='image/*' onChange={handleFile} />
      {uploading && <div>Uploading...</div>}
    </div>
  );
}
