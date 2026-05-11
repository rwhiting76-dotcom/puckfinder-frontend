import { NextResponse } from "next/server";

const API_BASE = "https://puckfinder-api.onrender.com";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  const targetUrl = qs ? `${API_BASE}/coaches?${qs}` : `${API_BASE}/coaches`;
  const res = await fetch(targetUrl, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${API_BASE}/coaches/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}