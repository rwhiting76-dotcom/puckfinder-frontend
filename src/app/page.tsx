"use client";

import { useEffect, useState } from "react";
import { fetchSessions, fetchRinks } from "@/lib/api";
import type { Session, Rink } from "@/lib/api";
import SessionsPage from "./sessions-page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(retryCount = 0) {
      try {
        console.log("[puckfinder] Fetching from", API_BASE, retryCount > 0 ? `(retry ${retryCount})` : "");
        const [s, r] = await Promise.all([
          fetchSessions(14),
          fetchRinks(),
        ]);
        if (!cancelled) {
          console.log("[puckfinder] Loaded", s.length, "sessions,", r.length, "rinks");
          setSessions(s);
          setRinks(r);
          setError(null);
        }
      } catch (e: any) {
        const msg = e?.message || "Unknown error";
        console.error("[puckfinder] Load failed:", msg);
        // Auto-retry up to 2 times (Render cold start can take 30s+)
        if (retryCount < 2 && !cancelled) {
          setRetrying(true);
          setTimeout(() => load(retryCount + 1), 5000);
          return;
        }
        if (!cancelled) {
          setError(`Failed to load: ${msg}. The server may be waking up — click Retry.`);
        }
      } finally {
        if (!cancelled && retryCount >= 2 || !error) {
          setLoading(false);
          setRetrying(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || retrying) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🏒</div>
          <p className="text-zinc-400">{retrying ? "Server is waking up..." : "Loading sessions..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🥅</div>
          <p className="text-zinc-400 text-sm px-4">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); }}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <SessionsPage initialSessions={sessions} rinks={rinks} />;
}