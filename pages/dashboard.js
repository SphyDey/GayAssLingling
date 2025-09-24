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

  // Links
  const [links, setLinks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const getProfileAndLinks = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
        setBio(profileData.bio || "");
        setAvatarUrl(profileData.avatar_url || "");
      }

      const { data: linksData } = await supabase
        .from("links")
        .select("id, title, url")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: true });

      setLinks(linksData || []);
      setLoading(false);
    };

    getProfileAndLinks();
  }, [router]);

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const updates = {
      id: user.id,
      username,
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

  // Add new link
  const addLink = async (e) => {
    e.preventDefault();

    if (!newTitle || !newUrl) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("links")
      .insert({
        profile_id: user.id,
        title: newTitle,
        url: newUrl,
      })
      .select()
      .single();

    if (!error && data) {
      setLinks([...links, data]);
      setNewTitle("");
      setNewUrl("");
    }
  };

  // Delete link
  const deleteLink = async (id) => {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (!error) {
      setLinks(links.filter((l) => l.id !== id));
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full">
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

        {/* Profile Form */}
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

        {/* Public Page Link */}
        {username && (
          <div className="mt-6 text-center">
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

        {/* Links Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Your Links</h2>

          <form onSubmit={addLink} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Link title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 border rounded-lg p-2"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 border rounded-lg p-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700"
            >
              Add
            </button>
          </form>

          <ul className="space-y-3">
            {links.map((link) => (
              <li
                key={link.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link.title}
                </a>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
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
