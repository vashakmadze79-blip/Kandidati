"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CandidateProfilePage() {
  const [userId, setUserId] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [languages, setLanguages] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [availability, setAvailability] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("მომხმარებელი ვერ მოიძებნა.");
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setHeadline(data.headline || "");
        setBio(data.bio || "");
        setExperienceYears(
          data.experience_years !== null && data.experience_years !== undefined
            ? String(data.experience_years)
            : ""
        );
        setSkills((data.skills || []).join(", "));
        setEducation(data.education || "");
        setLanguages((data.languages || []).join(", "));
        setSalaryExpectation(
          data.salary_expectation !== null &&
            data.salary_expectation !== undefined
            ? String(data.salary_expectation)
            : ""
        );
        setAvailability(data.availability || "");
        setLinkedinUrl(data.linkedin_url || "");
        setPortfolioUrl(data.portfolio_url || "");
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setMessage("მომხმარებელი ვერ მოიძებნა.");
      return;
    }

    setMessage("ინახება...");

    const cleanSkills = skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const cleanLanguages = languages
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase.from("candidate_profiles").upsert(
      {
        user_id: userId,
        headline,
        bio,
        experience_years: experienceYears
          ? Number(experienceYears)
          : null,
        skills: cleanSkills,
        education,
        languages: cleanLanguages,
        salary_expectation: salaryExpectation
          ? Number(salaryExpectation)
          : null,
        availability,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("პროფილი წარმატებით შეინახა.");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <a
          href="/candidate"
          className="text-sm font-medium text-gray-500 hover:text-black"
        >
          ← კანდიდატის სივრცეში დაბრუნება
        </a>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">ჩემი პროფესიული პროფილი</h1>

          <p className="mt-2 text-gray-600">
            შეავსე პროფილი ერთხელ და გამოიყენე მომავალ განაცხადებში.
          </p>

          <form onSubmit={handleSave} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                პროფესიული სათაური
              </label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="მაგ. ფინანსური ანალიტიკოსი"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                მოკლე აღწერა
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="მოკლედ აღწერე შენი გამოცდილება, ინტერესები და კარიერული მიზნები."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  გამოცდილება (წლები)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="მაგ. 3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  სასურველი ხელფასი
                </label>
                <input
                  type="number"
                  min="0"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="მაგ. 2500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                უნარები
              </label>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Excel, Project Management, SQL"
              />
              <p className="mt-2 text-xs text-gray-500">
                გამოყავი მძიმით.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                განათლება
              </label>
              <textarea
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="უნივერსიტეტი, პროგრამა, ხარისხი..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ენები
              </label>
              <input
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="ქართული, ინგლისური, ესპანური"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ხელმისაწვდომობა
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              >
                <option value="">აირჩიე</option>
                <option value="immediately">დაუყოვნებლივ</option>
                <option value="2_weeks">2 კვირაში</option>
                <option value="1_month">1 თვეში</option>
                <option value="not_looking">
                  აქტიურად არ ვეძებ, მაგრამ ღია ვარ შეთავაზებებისთვის
                </option>
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Portfolio / Website
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              პროფილის შენახვა
            </button>

            {message && (
              <p className="rounded-xl bg-gray-100 p-4 text-sm">{message}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}