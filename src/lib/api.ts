export type Session = {
  id: number;
  rink_id: number;
  rink_name: string | null;
  date: string;
  start_time: string;
  end_time: string;
  start_24: string | null;
  end_24: string | null;
  price: number | null;
  availability: string | null;
  session_type: string;
  source: string | null;
  source_url: string | null;
  notes: string | null;
};

export type Rink = {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  source_url: string | null;
  source_type: string | null;
  is_active: boolean;
  notes: string | null;
};

// Use Vercel API routes as proxy — avoids cross-origin fetch issues
const isBrowser = typeof window !== "undefined";
const API_BASE = isBrowser ? "" : (process.env.NEXT_PUBLIC_API_URL || "https://puckfinder-api.onrender.com");

export async function fetchSessions(days = 30): Promise<Session[]> {
  const url = isBrowser
    ? `/api/sessions?days=${days}`
    : `${API_BASE}/sessions/upcoming?days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sessions fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchRinks(): Promise<Rink[]> {
  const url = isBrowser ? "/api/rinks" : `${API_BASE}/rinks`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rinks fetch failed: ${res.status}`);
  return res.json();
}

export async function triggerScrape(source: string): Promise<any> {
  const url = isBrowser ? `/api/scrape?source=${source}` : `${API_BASE}/scrape/${source}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error("Scrape failed");
  return res.json();
}

export async function triggerScrapeAll(): Promise<any> {
  const url = isBrowser ? "/api/scrape" : `${API_BASE}/scrape`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error("Scrape all failed");
  return res.json();
}