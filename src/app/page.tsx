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

  useEffect(() => {
    async function load() {
      try {
        console.log("[puckfinder] Fetching from", API_BASE);
        const [s, r] = await Promise.all([
          fetchSessions(14),
          fetchRinks(),
        ]);
        console.log("[puckfinder] Loaded", s.length, "sessions,", r.length, "rinks");
        setSessions(s);
        setRinks(r);
      } catch (e: any) {
        const msg = e?.message || "Unknown error";
        console.error("[puckfinder] Load failed:", msg);
        setError(`Failed to load: ${msg}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🏒</div>
          <p className="text-zinc-400">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🥅</div>
          <p className="text-zinc-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <SessionsPage initialSessions={sessions} rinks={rinks} />;
}