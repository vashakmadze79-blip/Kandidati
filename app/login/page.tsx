"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("მიმდინარეობს ავტორიზაცია...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("ელ. ფოსტა ან პაროლი არასწორია.");
      return;
    }

    const user = data.user;

    if (!user) {
      setMessage("მომხმარებელი ვერ მოიძებნა.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setMessage("პროფილის ინფორმაცია ვერ მოიძებნა.");
      return;
    }

    if (profile.role === "candidate") {
      router.push("/candidate");
    } else if (profile.role === "employer") {
      router.push("/employer");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <a href="/" className="text-sm font-medium text-gray-500">
          ← მთავარ გვერდზე დაბრუნება
        </a>

        <h1 className="mt-6 text-3xl font-bold">შესვლა</h1>

        <p className="mt-2 text-gray-600">
          შედი შენს Kandidati ანგარიშში.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">ელ. ფოსტა</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="name@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">პაროლი</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="შეიყვანე პაროლი"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            შესვლა
          </button>

          {message && (
            <p className="rounded-xl bg-gray-100 p-4 text-sm">{message}</p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ჯერ არ გაქვს ანგარიში?{" "}
          <a href="/register" className="font-semibold text-black">
            რეგისტრაცია
          </a>
        </p>
      </div>
    </main>
  );
}
