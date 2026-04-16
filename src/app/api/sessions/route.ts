import { NextResponse } from "next/server";

const API_BASE = "https://puckfinder-api.onrender.com";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const res = await fetch(`${API_BASE}/sessions/upcoming${url.search}`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(data);
}