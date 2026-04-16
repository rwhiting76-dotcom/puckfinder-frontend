import { NextResponse } from "next/server";

const API_BASE = "https://puckfinder-api.onrender.com";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("source");
  const targetUrl = path ? `${API_BASE}/scrape/${path}` : `${API_BASE}/scrape`;
  const res = await fetch(targetUrl, { method: "POST" });
  const data = await res.json();
  return NextResponse.json(data);
}