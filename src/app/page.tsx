"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchSessions, fetchRinks } from "@/lib/api";
import type { Session, Rink } from "@/lib/api";
import SessionsPage from "./sessions-page";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([
        fetchSessions(14),
        fetchRinks(),
      ]);
      setSessions(s);
      setRinks(r);
    } catch (e: any) {
      setError(e?.message || "Failed to load. The server may be waking up — try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
          <p className="text-zinc-400 text-sm px-6">{error}</p>
          <button
            onClick={load}
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