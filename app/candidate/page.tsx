"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Profile = {
  full_name: string | null;
};

type CandidateProfile = {
  headline: string | null;
  bio: string | null;
  skills: string[] | null;
  education: string | null;
  languages: string[] | null;
  experience_years: number | null;
};

export default function CandidatePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [candidateProfile, setCandidateProfile] =
    useState<CandidateProfile | null>(null);

  const [applicationsCount, setApplicationsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single<Profile>();

      setName(profile?.full_name || "კანდიდატო");

      const { data: candidate } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle<CandidateProfile>();

      setCandidateProfile(candidate);

      const { count: applications } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", user.id);

      const { count: savedJobs } = await supabase
        .from("saved_jobs")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", user.id);

      const { count: interviews } = await supabase
        .from("interview_slots")
        .select("*", { count: "exact", head: true })
        .eq("booked_by", user.id);

      setApplicationsCount(applications || 0);
      setSavedJobsCount(savedJobs || 0);
      setInterviewsCount(interviews || 0);

      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  const calculateCompleteness = () => {
    if (!candidateProfile) return 0;

    const fields = [
      candidateProfile.headline,
      candidateProfile.bio,
      candidateProfile.education,
      candidateProfile.experience_years,
      candidateProfile.skills?.length,
      candidateProfile.languages?.length,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">იტვირთება...</p>
      </main>
    );
  }

  const completeness = calculateCompleteness();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold">
            Kandidati
          </a>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/jobs" className="hover:text-gray-500">
              ვაკანსიები
            </a>

            <a href="/candidate/profile" className="hover:text-gray-500">
              ჩემი პროფილი
            </a>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              გამოსვლა
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-gray-500">მოგესალმები,</p>
          <h1 className="mt-1 text-4xl font-bold">{name}</h1>
        </div>

        <section className="mt-10 rounded-3xl bg-black p-8 text-white">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-gray-300">პროფილის სისრულე</p>

              <h2 className="mt-2 text-3xl font-bold">
                {completeness}% დასრულებულია
              </h2>

              <p className="mt-2 max-w-xl text-gray-300">
                სრულად შევსებული პროფილი დაგეხმარება უფრო შესაბამისი
                ვაკანსიების მიღებასა და დამსაქმებლებისთვის უკეთ გამოჩენაში.
              </p>
            </div>

            <a
              href="/candidate/profile"
              className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-black"
            >
              პროფილის შევსება
            </a>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">ჩემი განაცხადები</p>
            <p className="mt-3 text-4xl font-bold">{applicationsCount}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">შენახული ვაკანსიები</p>
            <p className="mt-3 text-4xl font-bold">{savedJobsCount}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">მომავალი ინტერვიუები</p>
            <p className="mt-3 text-4xl font-bold">{interviewsCount}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">ჩემი განაცხადები</h2>

              <a href="#" className="text-sm font-semibold">
                ყველას ნახვა →
              </a>
            </div>

            {applicationsCount === 0 ? (
              <div className="py-12 text-center">
                <p className="font-medium">ჯერ განაცხადი არ გაქვს.</p>

                <p className="mt-2 text-sm text-gray-500">
                  იპოვე საინტერესო ვაკანსია და დაიწყე განაცხადის პროცესი.
                </p>

                <a
                  href="/jobs"
                  className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                >
                  ვაკანსიების ნახვა
                </a>
              </div>
            ) : (
              <p className="mt-6 text-gray-500">
                შენი განაცხადები აქ გამოჩნდება.
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">რეკომენდებული ვაკანსიები</h2>

            <div className="py-12 text-center">
              <p className="font-medium">
                პერსონალური რეკომენდაციები მალე გამოჩნდება.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                რეკომენდაციები დაეფუძნება შენს უნარებს, გამოცდილებას და
                ინტერესებს.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}