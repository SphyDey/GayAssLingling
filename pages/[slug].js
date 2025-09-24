// pages/[slug].js
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      // fetch profile by username (slug)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio")
        .eq("username", slug)
        .single();

      if (profileError || !profileData) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // fetch links for that profile
      const { data: linksData } = await supabase
        .from("links")
        .select("id, title, url, created_at")
        .eq("profile_id", profileData.id)
        .order("created_at", { ascending: true });

      setLinks(linksData || []);
      setLoading(false);
    };

    fetchProfile();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center">
        {/* Avatar */}
        <img
          src={profile.avatar_url || "/avatar-placeholder.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />

        {/* Username + Bio */}
        <h1 className="text-2xl font-bold">@{profile.username}</h1>
        <p className="text-gray-600">{profile.bio}</p>

        {/* Links */}
        <div className="mt-6 space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl shadow p-4 hover:bg-gray-100 transition"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
        }
