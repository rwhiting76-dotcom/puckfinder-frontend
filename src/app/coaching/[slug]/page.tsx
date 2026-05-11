"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchCoach } from "@/lib/api";
import type { Coach } from "@/lib/api";

export default function CoachProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchCoach(slug)
      .then(setCoach)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🏒</div>
          <p className="text-zinc-400">Loading coach profile...</p>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-zinc-400">{error || "Coach not found"}</p>
          <Link
            href="/coaching"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30"
          >
            Browse all coaches
          </Link>
        </div>
      </div>
    );
  }

  const initials = coach.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Back nav */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80 safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/coaching" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
            ← Back to Coaches
          </Link>
          <Link href="/" className="flex items-center gap-1.5">
            <img src="/favicon.svg" alt="PuckFinder" className="w-5 h-5" />
            <span className="text-xs text-zinc-500">PuckFinder</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 pb-24 safe-bottom w-full">
        {/* Coach header */}
        <div className="flex items-start gap-4 mt-6">
          {coach.photo_url ? (
            <img
              src={coach.photo_url}
              alt={coach.name}
              className="w-20 h-20 rounded-full object-cover shrink-0 bg-zinc-800 ring-2 ring-zinc-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 ring-2 ring-zinc-700">
              <span className="text-blue-400 font-bold text-2xl">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{coach.name}</h1>
              {coach.featured && (
                <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  ⭐ Featured
                </span>
              )}
            </div>
            {coach.title && (
              <p className="text-blue-400 font-medium mt-0.5">{coach.title}</p>
            )}
            {coach.location && (
              <p className="text-sm text-zinc-500 mt-1">📍 {coach.location}</p>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          {coach.price_range && (
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-3">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Pricing</p>
              <p className="text-sm font-semibold text-white mt-0.5">{coach.price_range}</p>
            </div>
          )}
          {coach.lesson_types && coach.lesson_types.length > 0 && (
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-3">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Lesson Types</p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {coach.lesson_types.join(" · ")}
              </p>
            </div>
          )}
        </div>

        {/* Specialties */}
        {coach.specialties && coach.specialties.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-zinc-400 mb-2">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {coach.specialties.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 text-sm border border-blue-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {coach.bio && (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-zinc-400 mb-2">About</h2>
            <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-3">
              <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">{coach.bio}</p>
            </div>
          </div>
        )}

        {/* Rink Affiliations */}
        {coach.rink_affiliations && coach.rink_affiliations.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-zinc-400 mb-2">Rink Affiliations</h2>
            <div className="flex flex-wrap gap-2">
              {coach.rink_affiliations.map((r) => (
                <span
                  key={r}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-sm"
                >
                  🏒 {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact section */}
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-zinc-400 mb-2">Contact</h2>
          <div className="space-y-2">
            {coach.contact_email && (
              <a
                href={`mailto:${coach.contact_email}`}
                className="flex items-center gap-2 rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-3 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all"
              >
                <span className="text-lg">✉️</span>
                <span className="text-sm text-zinc-300">{coach.contact_email}</span>
              </a>
            )}
            {coach.contact_phone && (
              <a
                href={`tel:${coach.contact_phone}`}
                className="flex items-center gap-2 rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-3 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all"
              >
                <span className="text-lg">📞</span>
                <span className="text-sm text-zinc-300">{coach.contact_phone}</span>
              </a>
            )}
            {coach.website_url && (
              <a
                href={coach.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-3 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all"
              >
                <span className="text-lg">🌐</span>
                <span className="text-sm text-blue-400 truncate">{coach.website_url}</span>
                <span className="text-zinc-600 ml-auto">↗</span>
              </a>
            )}
            {coach.instagram_url && (
              <a
                href={coach.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-3 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all"
              >
                <span className="text-lg">📸</span>
                <span className="text-sm text-blue-400 truncate">Instagram</span>
                <span className="text-zinc-600 ml-auto">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 mb-4">
          {coach.contact_email ? (
            <a
              href={`mailto:${coach.contact_email}`}
              className="block text-center w-full px-4 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              Contact {coach.name.split(" ")[0]}
            </a>
          ) : coach.website_url ? (
            <a
              href={coach.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full px-4 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              Visit Website
            </a>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-[11px] py-6 border-t border-zinc-900 safe-bottom">
        <p>PuckFinder · Find your next coach</p>
        <p className="mt-1"><Link href="/coaching" className="text-zinc-500 hover:text-zinc-400 transition">← All coaches</Link> · <Link href="/" className="text-zinc-500 hover:text-zinc-400 transition">Sessions</Link></p>
      </footer>
    </div>
  );
}