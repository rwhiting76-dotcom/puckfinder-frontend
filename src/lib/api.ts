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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 60000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchSessions(days = 7): Promise<Session[]> {
  const res = await fetchWithTimeout(`${API_BASE}/sessions/upcoming?days=${days}`);
  if (!res.ok) throw new Error(`Sessions fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchRinks(): Promise<Rink[]> {
  const res = await fetchWithTimeout(`${API_BASE}/rinks`);
  if (!res.ok) throw new Error(`Rinks fetch failed: ${res.status}`);
  return res.json();
}

export async function triggerScrape(source: string): Promise<any> {
  const res = await fetchWithTimeout(`${API_BASE}/scrape/${source}`, { method: "POST" }, 120000);
  if (!res.ok) throw new Error("Scrape failed");
  return res.json();
}

export async function triggerScrapeAll(): Promise<any> {
  const res = await fetchWithTimeout(`${API_BASE}/scrape`, { method: "POST" }, 120000);
  if (!res.ok) throw new Error("Scrape all failed");
  return res.json();
}