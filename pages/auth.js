// pages/auth.js
import { useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const user = data?.user;

    if (user) {
      // Create profile right away with username
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id, // user.id from Supabase Auth
          username, // chosen slug
        },
        { onConflict: "id" }
      );

      if (profileError) {
        setErrorMsg(profileError.message);
      } else {
        // Redirect after signup
        router.push("/dashboard");
      }
    }

    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white rounded-lg p-3 hover:bg-gray-900 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
    }
