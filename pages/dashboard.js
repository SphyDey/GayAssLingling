// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/src/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      }

      setLoading(false);
    };

    getProfile();
  }, [router]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    const updates = {
      id: user.id,
      username, // user can edit this
      bio,
      avatar_url: avatarUrl,
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Profile updated!");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={updateProfile} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

{/* Public Link Preview */}
{username && (
  <div className="mt-6 text-center">
    <p className="text-sm text-gray-600 mb-2">🔗 Your page:</p>
    <a
      href={`/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition"
    >
      View Public Page
    </a>
  </div>
)}

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-gray-800 text-white rounded-lg p-3 hover:bg-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
        }
