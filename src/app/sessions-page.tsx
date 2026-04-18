"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Session, Rink } from "@/lib/api";
import { triggerScrapeAll } from "@/lib/api";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";

  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(t: string) {
  return t.replace(/\s+/g, " ").trim();
}

function availabilityBadge(avail: string | null) {
  if (!avail) return null;
  const colors: Record<string, string> = {
    open: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25",
    limited: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25",
    full: "bg-red-500/15 text-red-400 ring-1 ring-red-500/25",
    unknown: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/25",
  };
  const labels: Record<string, string> = { open: "Available", limited: "Limited", full: "Full" };
  const cls = colors[avail] || colors.unknown;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${cls}`}>
      {labels[avail] || avail}
    </span>
  );
}

type Props = {
  initialSessions: Session[];
  rinks: Rink[];
};

export default function SessionsPage({ initialSessions, rinks }: Props) {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedRink, setSelectedRink] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const rinkMap: Record<number, Rink> = {};
  for (const r of rinks) rinkMap[r.id] = r;

  const filtered = useMemo(
    () => (selectedRink ? sessions.filter((s) => s.rink_id === selectedRink) : sessions),
    [sessions, selectedRink]
  );

  const grouped = useMemo(() => {
    const g: Record<string, Session[]> = {};
    for (const s of filtered) {
      if (!g[s.date]) g[s.date] = [];
      g[s.date].push(s);
    }
    return g;
  }, [filtered]);

  const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await triggerScrapeAll();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/sessions/upcoming?days=14`);
      if (res.ok) {
        const newSessions = await res.json();
        setSessions(newSessions);
      }
    } catch (e) {
      console.error("Refresh failed", e);
    }
    setRefreshing(false);
  };

  function getRegLink(session: Session): string | null {
    const rink = rinkMap[session.rink_id];
    if (rink?.website) return rink.website.startsWith("http") ? rink.website : `https://${rink.website}`;
    if (session.source_url) return session.source_url;
    if (rink?.source_url) return rink.source_url;
    return null;
  }

  // Count sessions per rink for the filter badges
  const rinkCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const s of sessions) {
      counts[s.rink_id] = (counts[s.rink_id] || 0) + 1;
    }
    return counts;
  }, [sessions]);

  const totalUpcoming = sessions.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80 safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-2xl">🏒</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">
                <span className="text-blue-400">Puck</span>Finder
              </h1>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {totalUpcoming} upcoming sessions · SLC area
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-xs font-medium border border-zinc-700/50 transition-all active:scale-95 disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>↻</span>
            {refreshing ? "Updating…" : "Refresh"}
          </button>
        </div>
      </header>

      {/* Rink Filters */}
      <div className="sticky top-[57px] z-10 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedRink(null)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
              selectedRink === null
                ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
            }`}
          >
            All
          </button>
          {rinks
            .filter((r) => r.is_active)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((rink) => (
              <button
                key={rink.id}
                onClick={() => setSelectedRink(selectedRink === rink.id ? null : rink.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                  selectedRink === rink.id
                    ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                    : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {rink.name
                  .replace(" Recreation Center", "")
                  .replace(" Ice Center", "")
                  .replace(" Ice Arena", "")
                  .replace(" County Sports Complex", "")}
              </button>
            ))}
        </div>
      </div>

      {/* Sessions List */}
      <main className="flex-1 max-w-2xl mx-auto px-4 pb-24 safe-bottom">
        {sortedDates.length === 0 && (
          <div className="text-center text-zinc-500 py-20">
            <div className="text-4xl mb-3">🥅</div>
            <p className="text-lg font-medium">No sessions found</p>
            <p className="text-sm mt-1">Try refreshing or selecting a different rink</p>
          </div>
        )}

        {sortedDates.map((date) => (
          <div key={date} className="mt-5">
            {/* Date header */}
            <div className="flex items-baseline justify-between mb-2 px-1">
              <h2 className="text-sm font-semibold text-zinc-300">
                {formatDate(date)}
              </h2>
              <span className="text-[11px] text-zinc-600">
                {grouped[date].length} session{grouped[date].length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Session cards */}
            <div className="space-y-2">
              {grouped[date]
                .sort((a, b) => (a.start_24 || a.start_time).localeCompare(b.start_24 || b.start_time))
                .map((s) => {
                  const regLink = getRegLink(s);

                  return (
                    <div
                      key={s.id}
                      className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-2.5 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all"
                    >
                      {/* Top: time + rink name */}
                      <div className="flex items-baseline gap-2">
                        <div className="text-sm font-semibold text-white whitespace-nowrap">
                          {formatTime(s.start_time)}
                        </div>
                        <div className="text-sm font-medium text-zinc-200 truncate">
                          {s.rink_name}
                        </div>
                      </div>
                      {/* Bottom: session type + badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1 pl-0">
                        <span className="text-xs text-zinc-500">
                          {formatTime(s.end_time) !== formatTime(s.start_time) && (
                            <>to {formatTime(s.end_time)} · </>
                          )}
                          {s.session_type}
                        </span>
                        {s.price != null && (
                          <span className="text-xs text-zinc-400 font-medium">
                            ${s.price.toFixed(0)}
                          </span>
                        )}
                        {availabilityBadge(s.availability)}
                        {regLink && (
                          <a
                            href={regLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition ml-auto"
                          >
                            Website ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-[11px] py-6 border-t border-zinc-900 safe-bottom">
        <p>PuckFinder · Schedules from rink websites · Verify before you go</p>
        <p className="mt-1"><Link href="/contact" className="text-zinc-500 hover:text-zinc-400 transition">Contact</Link></p>
      </footer>
    </div>
  );
}