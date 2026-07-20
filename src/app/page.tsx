"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchSessions, fetchRinks } from "@/lib/api";
import type { Session, Rink } from "@/lib/api";
import SessionsPage from "./sessions-page";
import LoadingSkeleton from "./loading-skeleton";

const CACHE_KEY_SESSIONS = "pf:sessions:v1";
const CACHE_KEY_RINKS = "pf:rinks:v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

type Cache<T> = { data: T; ts: number };

function loadCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: Cache<T> = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function saveCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>(() => loadCache(CACHE_KEY_SESSIONS) || []);
  const [rinks, setRinks] = useState<Rink[]>(() => loadCache(CACHE_KEY_RINKS) || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCache = sessions.length > 0 && rinks.length > 0;

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([
        fetchSessions(14),
        fetchRinks(),
      ]);
      setSessions(s);
      setRinks(r);
      saveCache(CACHE_KEY_SESSIONS, s);
      saveCache(CACHE_KEY_RINKS, r);
    } catch (e: any) {
      if (!hasCache) {
        setError(e?.message || "Failed to load. The server may be waking up — try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [hasCache]);

  useEffect(() => {
    load(hasCache); // if cache exists, do silent background refresh
  }, [load, hasCache]);

  if (loading && !hasCache) {
    return <LoadingSkeleton />;
  }

  if (error && !hasCache) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <img src="/favicon.svg" alt="PuckFinder" className="w-16 h-16 mb-4 mx-auto" />
          <p className="text-zinc-400 text-sm px-6">{error}</p>
          <button
            onClick={() => load()}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <SessionsPage initialSessions={sessions} rinks={rinks} refreshing={loading && hasCache} />;
}
