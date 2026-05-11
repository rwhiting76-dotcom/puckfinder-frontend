"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchCoaches } from "@/lib/api";
import type { Coach } from "@/lib/api";

const SPECIALTIES = [
  "Power Skating",
  "Stick Handling",
  "Shooting",
  "Goalie",
  "Checking",
  "Conditioning",
  "Beginner",
  "Youth",
];

const LESSON_TYPES = [
  "Private",
  "Group",
  "Team",
  "On-Ice",
  "Off-Ice",
];

function CoachCard({ coach }: { coach: Coach }) {
  const initials = coach.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Link href={`/coaching/${coach.slug}`} className="block group">
      <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all">
        <div className="flex items-start gap-3">
          {/* Photo or initials */}
          {coach.photo_url ? (
            <img
              src={coach.photo_url}
              alt={coach.name}
              className="w-14 h-14 rounded-full object-cover shrink-0 bg-zinc-800"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold text-lg">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{coach.name}</h3>
              {coach.featured && (
                <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Featured
                </span>
              )}
            </div>
            {coach.title && (
              <p className="text-sm text-blue-400 mt-0.5">{coach.title}</p>
            )}
            {coach.location && (
              <p className="text-xs text-zinc-500 mt-0.5">{coach.location}</p>
            )}
            {/* Specialties */}
            {coach.specialties && coach.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {coach.specialties.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400"
                  >
                    {s}
                  </span>
                ))}
                {coach.specialties.length > 3 && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                    +{coach.specialties.length - 3}
                  </span>
                )}
              </div>
            )}
            {/* Price & lesson types */}
            <div className="flex items-center gap-2 mt-2">
              {coach.price_range && (
                <span className="text-xs font-medium text-zinc-300">
                  {coach.price_range}
                </span>
              )}
              {coach.lesson_types && coach.lesson_types.length > 0 && (
                <span className="text-[11px] text-zinc-500">
                  {coach.lesson_types.join(" · ")}
                </span>
              )}
            </div>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition shrink-0 mt-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CoachingPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedLessonType, setSelectedLessonType] = useState<string | null>(null);

  useEffect(() => {
    fetchCoaches()
      .then(setCoaches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = coaches;
    if (selectedSpecialty) {
      result = result.filter(
        (c) => c.specialties?.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase())
      );
    }
    if (selectedLessonType) {
      result = result.filter(
        (c) => c.lesson_types?.some((t) => t.toLowerCase() === selectedLessonType.toLowerCase())
      );
    }
    return result;
  }, [coaches, selectedSpecialty, selectedLessonType]);

  const featuredCoaches = filtered.filter((c) => c.featured);
  const otherCoaches = filtered.filter((c) => !c.featured);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80 safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="PuckFinder" className="w-7 h-7" />
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">
                <span className="text-blue-400">Puck</span>Finder
              </h1>
            </div>
          </Link>
          <Link
            href="/coaching/apply"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-all active:scale-95"
          >
            List Your Coaching
          </Link>
        </div>
      </header>

      {/* Title */}
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-2">
        <h2 className="text-2xl font-bold tracking-tight">Hockey Coaches</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Find private and group coaching in the Salt Lake City area
        </p>
      </div>

      {/* Specialty Filters */}
      <div className="sticky top-[57px] z-10 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setSelectedSpecialty(null); setSelectedLessonType(null); }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
              !selectedSpecialty && !selectedLessonType
                ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
            }`}
          >
            All
          </button>
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(selectedSpecialty === spec ? null : spec)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                selectedSpecialty === spec
                  ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {spec}
            </button>
          ))}
          <div className="w-px bg-zinc-800 shrink-0 mx-1" />
          {LESSON_TYPES.map((lt) => (
            <button
              key={lt}
              onClick={() => setSelectedLessonType(selectedLessonType === lt ? null : lt)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                selectedLessonType === lt
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {lt}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto px-4 pb-24 safe-bottom w-full">
        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🏒</div>
            <p className="text-zinc-400">Loading coaches...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-zinc-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🥅</div>
            <p className="text-lg font-medium text-zinc-300">No coaches found</p>
            <p className="text-sm text-zinc-500 mt-1">
              {coaches.length === 0
                ? "Coaches haven't been listed yet. Check back soon!"
                : "Try adjusting your filters"}
            </p>
            {coaches.length === 0 && (
              <Link
                href="/coaching/apply"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30"
              >
                Be the first coach to list
              </Link>
            )}
          </div>
        )}

        {!loading && featuredCoaches.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-yellow-400/80 mb-2 px-1">
              ⭐ Featured Coaches
            </h3>
            <div className="space-y-2">
              {featuredCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          </div>
        )}

        {!loading && otherCoaches.length > 0 && (
          <div className={featuredCoaches.length > 0 ? "mt-5" : "mt-4"}>
            {featuredCoaches.length > 0 && (
              <h3 className="text-sm font-semibold text-zinc-500 mb-2 px-1">
                All Coaches
              </h3>
            )}
            <div className="space-y-2">
              {otherCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-[11px] py-6 border-t border-zinc-900 safe-bottom">
        <p>PuckFinder · Find your next coach · <Link href="/coaching/apply" className="text-zinc-500 hover:text-zinc-400 transition">List your coaching</Link></p>
        <p className="mt-1"><Link href="/" className="text-zinc-500 hover:text-zinc-400 transition">← Back to sessions</Link></p>
      </footer>
    </div>
  );
}