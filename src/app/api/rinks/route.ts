import { NextResponse } from "next/server";

const API_BASE = "https://puckfinder-api.onrender.com";

export async function GET() {
  const res = await fetch(`${API_BASE}/rinks`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(data);
}