"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "employer">("candidate");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("მიმდინარეობს რეგისტრაცია...");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "რეგისტრაცია წარმატებით დასრულდა. შეამოწმე ელ. ფოსტა ანგარიშის დასადასტურებლად."
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <a href="/" className="text-sm font-medium text-gray-500">
          ← მთავარ გვერდზე დაბრუნება
        </a>

        <h1 className="mt-6 text-3xl font-bold">შექმენი ანგარიში</h1>

        <p className="mt-2 text-gray-600">
          აირჩიე როგორ გინდა გამოიყენო Kandidati.
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              სახელი და გვარი
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="მაგ. ანკა ორბელაძე"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="მინიმუმ 8 სიმბოლო"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">მე ვარ:</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={`rounded-xl border p-4 text-left ${
                  role === "candidate"
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                }`}
              >
                <div className="font-semibold">სამუშაოს მაძიებელი</div>
                <div className="mt-1 text-sm opacity-70">
                  მინდა ვიპოვო ახალი შესაძლებლობა
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`rounded-xl border p-4 text-left ${
                  role === "employer"
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                }`}
              >
                <div className="font-semibold">დამსაქმებელი</div>
                <div className="mt-1 text-sm opacity-70">
                  მინდა ვიპოვო კანდიდატები
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            რეგისტრაცია
          </button>

          {message && (
            <p className="rounded-xl bg-gray-100 p-4 text-sm">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}