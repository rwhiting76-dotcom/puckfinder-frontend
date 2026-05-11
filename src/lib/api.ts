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

// ── Coach types ─────────────────────────────────────────────────────────────

export type Coach = {
  id: number;
  slug: string;
  name: string;
  title: string | null;
  photo_url: string | null;
  bio: string | null;
  location: string | null;
  rink_affiliations: string[] | null;
  specialties: string[] | null;
  lesson_types: string[] | null;
  price_range: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  instagram_url: string | null;
  featured: boolean;
};

export type CoachApplication = {
  name: string;
  title?: string;
  photo_url?: string;
  bio?: string;
  location?: string;
  rink_affiliations?: string[];
  specialties?: string[];
  lesson_types?: string[];
  price_range?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  instagram_url?: string;
};

export async function fetchCoaches(filters?: { specialty?: string; lesson_type?: string }): Promise<Coach[]> {
  const params = new URLSearchParams();
  if (filters?.specialty) params.set("specialty", filters.specialty);
  if (filters?.lesson_type) params.set("lesson_type", filters.lesson_type);
  const qs = params.toString();
  const url = isBrowser ? `/api/coaches${qs ? `?${qs}` : ""}` : `${API_BASE}/coaches${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Coaches fetch failed: ${res.status}`);
  const data = await res.json();
  // Gracefully handle non-array responses (e.g. backend not yet deployed)
  if (!Array.isArray(data)) return [];
  return data;
}

export async function fetchCoach(slug: string): Promise<Coach> {
  const url = isBrowser ? `/api/coaches/${slug}` : `${API_BASE}/coaches/${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Coach fetch failed: ${res.status}`);
  return res.json();
}

export async function submitCoachApplication(data: CoachApplication): Promise<Coach> {
  const url = isBrowser ? "/api/coaches/apply" : `${API_BASE}/coaches/apply`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Coach application failed: ${res.status}`);
  return res.json();
}