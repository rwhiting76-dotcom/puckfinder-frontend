"use client";

import { useEffect, useState } from "react";
import { fetchSessions, fetchRinks } from "@/lib/api";
import type { Session, Rink } from "@/lib/api";
import SessionsPage from "./sessions-page";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([
          fetchSessions(14),
          fetchRinks(),
        ]);
        setSessions(s);
        setRinks(r);
      } catch (e) {
        setError("Failed to load sessions. Please try again.");
        console.error(e);
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
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return <SessionsPage initialSessions={sessions} rinks={rinks} />;
}