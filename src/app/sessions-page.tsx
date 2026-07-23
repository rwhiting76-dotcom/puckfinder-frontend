"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Dices, ExternalLink, MapPin, RotateCw } from "lucide-react";
import type { Session, Rink } from "@/lib/api";
import { triggerScrapeAll, fetchCoaches } from "@/lib/api";
import type { Coach } from "@/lib/api";

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



type DateFilter = "all" | "today" | "tomorrow" | "weekend" | "week";

function isWeekendDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  return day === 0 || day === 6;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff < days;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
}

function isTomorrow(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.getTime() === tomorrow.getTime();
}

type Props = {
  initialSessions: Session[];
  rinks: Rink[];
  refreshing?: boolean;
};

export default function SessionsPage({ initialSessions, rinks, refreshing }: Props) {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedRink, setSelectedRink] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    fetchCoaches({}).then(setCoaches).catch(() => setCoaches([]));
  }, []);

  const featuredCoaches = useMemo(() => {
    const active = coaches.filter((c) => !c.contact_email || c.contact_email);
    const featured = active.filter((c) => c.featured);
    const pool = featured.length > 0 ? featured : active;
    return pool.slice(0, 3);
  }, [coaches]);

  const rinkMap: Record<number, Rink> = {};
  for (const r of rinks) rinkMap[r.id] = r;

  const filtered = useMemo(() => {
    let list = selectedRink ? sessions.filter((s) => s.rink_id === selectedRink) : sessions;
    if (dateFilter === "today") list = list.filter((s) => isToday(s.date));
    if (dateFilter === "tomorrow") list = list.filter((s) => isTomorrow(s.date));
    if (dateFilter === "weekend") list = list.filter((s) => isWeekendDate(s.date));
    if (dateFilter === "week") list = list.filter((s) => isWithinDays(s.date, 7));
    return list;
  }, [sessions, selectedRink, dateFilter]);

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
    setLocalRefreshing(true);
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
    setLocalRefreshing(false);
  };

  function getRegLink(session: Session): string | null {
    const rink = rinkMap[session.rink_id];
    if (rink?.website) return rink.website.startsWith("http") ? rink.website : `https://${rink.website}`;
    if (session.source_url) return session.source_url;
    if (rink?.source_url) return rink.source_url;
    return null;
  }

  const selectedRinkName = useMemo(() => {
    if (!selectedRink) return null;
    return rinks.find((r) => r.id === selectedRink)?.name || null;
  }, [selectedRink, rinks]);

  // Upcoming sessions outside the current filter, sorted by nearest
  const fallbackSessions = useMemo(() => {
    if (!selectedRink) return [];
    const filtered = sessions.filter((s) => s.rink_id !== selectedRink);
    return filtered.slice(0, 3);
  }, [selectedRink, sessions]);

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
        {refreshing && (
          <div className="h-0.5 bg-zinc-800 w-full">
            <div className="h-full bg-blue-500/60 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: "40%" }} />
          </div>
        )}
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="PuckFinder" className="w-9 h-9" />
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">
                <span className="text-blue-400">Puck</span>Finder
              </h1>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {totalUpcoming} upcoming sessions · SLC area
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/coaching"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-xs font-medium border border-zinc-700/50 transition-all active:scale-95 text-zinc-300"
            >
              Coaching
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-xs font-medium border border-zinc-700/50 transition-all active:scale-95 text-zinc-300"
            >
              Contact
            </Link>
            <button
              onClick={handleRefresh}
              disabled={localRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-xs font-medium border border-zinc-700/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${localRefreshing ? "animate-spin" : ""}`} />
              {localRefreshing ? "Updating…" : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      {/* Coaching CTA */}
      {featuredCoaches.length > 0 && (
        <div className="bg-zinc-900/40 border-b border-zinc-800/50">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">
                  Improve your game
                </p>
                <p className="text-sm text-zinc-300 mt-0.5">
                  Local coaches offering private and group lessons
                </p>
              </div>
              <Link
                href="/coaching"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30 hover:bg-blue-500/30 transition"
              >
                View coaches →
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
              {featuredCoaches.map((coach) => (
                <Link
                  key={coach.id}
                  href={`/coaching/${coach.slug}`}
                  className="shrink-0 w-48 rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-2.5 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition"
                >
                  <p className="text-sm font-semibold text-zinc-200 truncate">{coach.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{coach.title || "Private coach"}</p>
                  {coach.specialties && coach.specialties.length > 0 && (
                    <p className="text-[11px] text-blue-400 mt-1 truncate">
                      {coach.specialties.slice(0, 2).join(" · ")}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Filters */}
      <div className="bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-thin">
          {[
            { key: "all", label: "All dates" },
            { key: "today", label: "Today" },
            { key: "tomorrow", label: "Tomorrow" },
            { key: "weekend", label: "This weekend" },
            { key: "week", label: "Next 7 days" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setDateFilter((prev) => (prev === (opt.key as DateFilter) ? "all" : (opt.key as DateFilter)))}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                dateFilter === opt.key
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rink Filters */}
      <div className="sticky top-[57px] z-10 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-thin">
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
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
              <Dices className="w-8 h-8 text-zinc-500" />
            </div>
            {selectedRink ? (
              <>
                <p className="text-lg font-semibold text-zinc-300">
                  No sessions at {selectedRinkName?.replace(" Recreation Center", "")?.replace(" Ice Center", "")?.replace(" Ice Arena", "")?.replace(" County Sports Complex", "")}
                </p>
                <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  No Stick & Puck or Drop In times posted there in the next 14 days.
                </p>
                <button
                  onClick={() => setSelectedRink(null)}
                  className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition"
                >
                  Show all rinks
                </button>

                {fallbackSessions.length > 0 && (
                  <div className="mt-8 text-left">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2 text-center">
                      Upcoming at other rinks
                    </p>
                    <div className="space-y-2">
                      {fallbackSessions.map((s) => {
                        const regLink = getRegLink(s);
                        return (
                          <div
                            key={s.id}
                            className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-2.5 text-left"
                          >
                            <div className="flex items-baseline gap-2">
                              <div className="text-sm font-semibold text-white whitespace-nowrap">{formatTime(s.start_time)}</div>
                              <div className="text-sm font-semibold text-blue-300 truncate">{s.rink_name}</div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              <span className="text-xs text-zinc-500">
                                {formatDate(s.date)} · {s.session_type}
                              </span>
                              {s.price != null && (
                                <span className="text-xs text-zinc-400 font-medium">${s.price.toFixed(0)}</span>
                              )}
                              {regLink && (
                                <a
                                  href={regLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition ml-auto"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-zinc-300">No upcoming sessions</p>
                <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  We don’t see any Stick & Puck or Drop In times posted in the next 14 days.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={localRefreshing}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium border border-zinc-700 hover:bg-zinc-700 transition disabled:opacity-50"
                  >
                    {localRefreshing ? "Checking…" : "Refresh data"}
                  </button>
                </div>
              </>
            )}
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
                      onClick={() => setExpandedId((prev) => (prev === s.id ? null : s.id))}
                      className={`rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-2.5 hover:bg-zinc-800/70 hover:border-zinc-700/50 transition-all cursor-pointer ${expandedId === s.id ? "bg-zinc-800/70 border-zinc-700/60" : ""}`}
                    >
                      {/* Top: time + rink name */}
                      <div className="flex items-baseline gap-2">
                        <div className="text-sm font-semibold text-white whitespace-nowrap">
                          {formatTime(s.start_time)}
                        </div>
                        <div className="text-sm font-semibold text-blue-300 truncate">
                          {s.rink_name}
                        </div>
                        <div className="ml-auto text-zinc-500">
                          {expandedId === s.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

                        {regLink && (
                          <a
                            href={regLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition ml-auto"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Expanded details */}
                      {expandedId === s.id && (
                        <div className="mt-3 pt-3 border-t border-zinc-800/60 text-left space-y-2">
                          {s.notes && (
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {s.notes}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                            {s.price != null && (
                              <span><span className="text-zinc-600">Price:</span> ${s.price.toFixed(0)}</span>
                            )}
                            {s.availability && (
                              <span><span className="text-zinc-600">Availability:</span> {s.availability}</span>
                            )}
                            {s.source && (
                              <span><span className="text-zinc-600">Source:</span> {s.source}</span>
                            )}
                          </div>

                          {rinkMap[s.rink_id] && (
                            <div className="text-xs text-zinc-500 space-y-0.5">
                              {rinkMap[s.rink_id].address && <p className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-zinc-600" /> {rinkMap[s.rink_id].address}</p>}
                              {(rinkMap[s.rink_id].phone || rinkMap[s.rink_id].website) && (
                                <p className="flex flex-wrap gap-x-3">
                                  {rinkMap[s.rink_id].phone && <span>{rinkMap[s.rink_id].phone}</span>}
                                  {rinkMap[s.rink_id].website && (
                                    <a
                                      href={(rinkMap[s.rink_id].website || "").startsWith("http") ? (rinkMap[s.rink_id].website || "") : `https://${rinkMap[s.rink_id].website}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      {(rinkMap[s.rink_id].website || "").replace(/^https?:\/\//, "")}
                                    </a>
                                  )}
                                </p>
                              )}
                            </div>
                          )}

                          {regLink && (
                            <a
                              href={regLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 mt-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30 hover:bg-blue-500/30 transition"
                            >
                              <span className="inline-flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> Register / More info</span>
                            </a>
                          )}
                        </div>
                      )}
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