"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CompanyProfilePage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("ავტორიზაცია საჭიროა.");
        return;
      }

      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (data) {
        setCompanyId(data.id);
        setName(data.name || "");
        setDescription(data.description || "");
        setWebsite(data.website || "");
        setIndustry(data.industry || "");
        setLocation(data.location || "");
        setCompanySize(data.company_size || "");
      }
    };

    loadCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("ინახება...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("ავტორიზაცია საჭიროა.");
      return;
    }

    if (companyId) {
      const { error } = await supabase
        .from("companies")
        .update({
          name,
          description,
          website,
          industry,
          location,
          company_size: companySize,
        })
        .eq("id", companyId);

      if (error) {
        setMessage(error.message);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("companies")
        .insert({
          owner_id: user.id,
          name,
          description,
          website,
          industry,
          location,
          company_size: companySize,
        })
        .select("id")
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setCompanyId(data.id);
    }

    setMessage("კომპანიის პროფილი წარმატებით შეინახა.");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <a href="/employer" className="text-sm text-gray-500">
          ← დამსაქმებლის სივრცეში დაბრუნება
        </a>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">კომპანიის პროფილი</h1>

          <p className="mt-2 text-gray-600">
            ეს ინფორმაცია გამოჩნდება თქვენს ვაკანსიებთან ერთად.
          </p>

          <form onSubmit={handleSave} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                კომპანიის სახელი
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="მაგ. ABC Company"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                კომპანიის შესახებ
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="მოკლედ აღწერეთ კომპანია."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ინდუსტრია
              </label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="მაგ. ფინანსები, ტექნოლოგიები, ჯანდაცვა"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ლოკაცია
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="მაგ. თბილისი"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                კომპანიის ზომა
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              >
                <option value="">აირჩიე</option>
                <option value="1-10">1–10 თანამშრომელი</option>
                <option value="11-50">11–50 თანამშრომელი</option>
                <option value="51-200">51–200 თანამშრომელი</option>
                <option value="201-500">201–500 თანამშრომელი</option>
                <option value="500+">500+ თანამშრომელი</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                ვებგვერდი
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="https://company.ge"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              კომპანიის პროფილის შენახვა
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