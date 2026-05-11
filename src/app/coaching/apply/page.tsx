"use client";

import { useState } from "react";
import Link from "next/link";
import { submitCoachApplication } from "@/lib/api";
import type { CoachApplication } from "@/lib/api";

const SPECIALTY_OPTIONS = [
  "Power Skating",
  "Stick Handling",
  "Shooting",
  "Goalie",
  "Checking",
  "Conditioning",
  "Beginner",
  "Youth",
];

const LESSON_TYPE_OPTIONS = [
  "Private",
  "Group",
  "Team",
  "On-Ice",
  "Off-Ice",
];

export default function CoachApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CoachApplication>({
    name: "",
    title: "",
    bio: "",
    location: "",
    specialties: [],
    lesson_types: [],
    price_range: "",
    contact_email: "",
    contact_phone: "",
    website_url: "",
    instagram_url: "",
  });

  const updateField = (field: keyof CoachApplication, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleItem = (field: "specialties" | "lesson_types", item: string) => {
    setForm((prev) => {
      const current = (prev[field] as string[]) || [];
      const next = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // Save to DB
      await submitCoachApplication(form);
      // Notify Ryan via Formspree (same as contact form)
      try {
        const notifData = new FormData();
        notifData.append("name", form.name);
        notifData.append("email", form.contact_email || "(not provided)");
        notifData.append("message", `New coach application on PuckFinder!\n\nName: ${form.name}\nTitle: ${form.title || "(none)"}\nLocation: ${form.location || "(none)"}\nSpecialties: ${form.specialties?.join(", ") || "(none)"}\nLesson Types: ${form.lesson_types?.join(", ") || "(none)"}\nPrice Range: ${form.price_range || "(none)"}\nEmail: ${form.contact_email || "(none)"}\nPhone: ${form.contact_phone || "(none)"}\nWebsite: ${form.website_url || "(none)"}\nInstagram: ${form.instagram_url || "(none)"}\n\nApprove at: /admin/coaches/pending`);
        await fetch("https://formspree.io/f/xnjljrrn", {
          method: "POST",
          body: notifData,
          headers: { Accept: "application/json" },
        });
      } catch {
        // Notification failure shouldn't block the application
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
          <p className="text-zinc-400 mb-6">
            Thanks for applying, {form.name}! We&apos;ll review your profile and get it live on PuckFinder within 24-48 hours.
          </p>
          <Link
            href="/coaching"
            className="inline-block px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30"
          >
            Browse coaches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80 safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/coaching" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
            ← Coaches
          </Link>
          <Link href="/" className="flex items-center gap-1.5">
            <img src="/favicon.svg" alt="PuckFinder" className="w-5 h-5" />
            <span className="text-xs text-zinc-500">PuckFinder</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 pb-24 safe-bottom w-full">
        <div className="mt-5 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">List Your Coaching</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Reach hockey players looking for instruction in the SLC area. Free to list.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Coach Mike Johnson"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Title / Specialty
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Power Skating & Skills Coach"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={form.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. Salt Lake City, UT"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Specialties
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((spec) => {
                const selected = form.specialties?.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleItem("specialties", spec)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                        : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Types */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Lesson Types
            </label>
            <div className="flex flex-wrap gap-2">
              {LESSON_TYPE_OPTIONS.map((lt) => {
                const selected = form.lesson_types?.includes(lt);
                return (
                  <button
                    key={lt}
                    type="button"
                    onClick={() => toggleItem("lesson_types", lt)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                        : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {lt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Price Range
            </label>
            <input
              type="text"
              value={form.price_range || ""}
              onChange={(e) => updateField("price_range", e.target.value)}
              placeholder="e.g. $50-75/session"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Bio / About
            </label>
            <textarea
              value={form.bio || ""}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell players about your coaching philosophy, experience, and what makes your sessions unique..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm resize-none"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={form.photo_url || ""}
              onChange={(e) => updateField("photo_url", e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
            <p className="text-[11px] text-zinc-600 mt-1">Link to a headshot or coaching photo</p>
          </div>

          {/* Contact — divider */}
          <div className="pt-2 border-t border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-400 mb-3">Contact Info</h2>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.contact_email || ""}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="coach@example.com"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={form.contact_phone || ""}
              onChange={(e) => updateField("contact_phone", e.target.value)}
              placeholder="(801) 555-1234"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Website
            </label>
            <input
              type="url"
              value={form.website_url || ""}
              onChange={(e) => updateField("website_url", e.target.value)}
              placeholder="https://your-coaching-site.com"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={form.instagram_url || ""}
              onChange={(e) => updateField("instagram_url", e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-[11px] text-zinc-600 text-center">
            Your profile will be reviewed before going live. Usually within 24-48 hours.
          </p>
        </form>
      </main>
    </div>
  );
}