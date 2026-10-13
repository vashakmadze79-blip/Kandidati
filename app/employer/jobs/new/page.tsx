"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function NewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workMode, setWorkMode] = useState("onsite");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("ვაკანსია ინახება...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("ავტორიზაცია საჭიროა.");
      return;
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (companyError || !company) {
      setMessage("ჯერ კომპანიის პროფილი უნდა შექმნა.");
      return;
    }

    const { error } = await supabase.from("jobs").insert({
      company_id: company.id,
      title,
      description,
      requirements,
      location,
      employment_type: employmentType,
      work_mode: workMode,
      salary_min: salaryMin ? Number(salaryMin) : null,
      salary_max: salaryMax ? Number(salaryMax) : null,
      currency: "GEL",
      status: "published",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("ვაკანსია წარმატებით გამოქვეყნდა.");
    router.push("/employer");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <a href="/employer" className="text-sm text-gray-500">
          ← დამსაქმებლის სივრცეში დაბრუნება
        </a>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">ახალი ვაკანსია</h1>

          <p className="mt-2 text-gray-600">
            შეავსე ვაკანსიის ძირითადი ინფორმაცია.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                ვაკანსიის დასახელება
              </label>

              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="მაგ. ფინანსური ანალიტიკოსი"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ვაკანსიის აღწერა
              </label>

              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="აღწერე პოზიცია, ძირითადი მოვალეობები და სამუშაოს მიზანი"
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                მოთხოვნები
              </label>

              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="გამოცდილება, განათლება, უნარები..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ლოკაცია
              </label>

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="მაგ. თბილისი"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                დასაქმების ტიპი
              </label>

              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              >
                <option value="">აირჩიე</option>
                <option value="full-time">სრული განაკვეთი</option>
                <option value="part-time">ნახევარი განაკვეთი</option>
                <option value="contract">კონტრაქტი</option>
                <option value="internship">სტაჟირება</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                სამუშაო რეჟიმი
              </label>

              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              >
                <option value="onsite">ოფისში</option>
                <option value="hybrid">ჰიბრიდული</option>
                <option value="remote">დისტანციური</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  მინ. ხელფასი
                </label>

                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="მაგ. 2000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  მაქს. ხელფასი
                </label>

                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="მაგ. 3000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              ვაკანსიის გამოქვეყნება
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