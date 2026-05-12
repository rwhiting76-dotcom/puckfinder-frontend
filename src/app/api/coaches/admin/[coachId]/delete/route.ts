import { NextResponse } from "next/server";

const API_BASE = "https://puckfinder-api.onrender.com";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ coachId: string }> }
) {
  const { coachId } = await params;
  const adminKey = request.headers.get("X-Admin-Key") || "";
  const res = await fetch(`${API_BASE}/admin/coaches/${coachId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": adminKey,
    },
  });
  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}