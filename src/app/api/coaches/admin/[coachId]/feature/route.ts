import { NextResponse } from "next/server";

const API_BASE = "https://puckfinder-api.onrender.com";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ coachId: string }> }
) {
  const { coachId } = await params;
  const adminKey = request.headers.get("X-Admin-Key") || "";
  const res = await fetch(`${API_BASE}/admin/coaches/${coachId}/feature`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": adminKey,
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}