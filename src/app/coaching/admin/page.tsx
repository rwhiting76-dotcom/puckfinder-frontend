"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Lock, MapPin, Star, Trash2, ExternalLink } from "lucide-react";
import SiteHeader from "@/components/site-header";

const ADMIN_KEY_STORAGE = "pf_admin_key";

type Coach = {
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
  approved: boolean;
};

function CoachCard({ coach, onAction }: { coach: Coach; onAction: (id: number, action: string) => void }) {
  const initials = coach.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4">
      <div className="flex items-start gap-3">
        {coach.photo_url ? (
          <img src={coach.photo_url} alt={coach.name} className="w-12 h-12 rounded-full object-cover shrink-0 bg-zinc-800" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <span className="text-blue-400 font-bold">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white">{coach.name}</h3>
            {coach.featured && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 inline-flex items-center gap-1">
                <Star className="w-3 h-3" /> Featured
              </span>
            )}
          </div>
          {coach.title && <p className="text-sm text-blue-400">{coach.title}</p>}
          {coach.location && <p className="text-xs text-zinc-500 mt-0.5 inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {coach.location}</p>}
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm">
        {coach.specialties && coach.specialties.length > 0 && (
          <p className="text-zinc-400"><span className="text-zinc-500">Specialties:</span> {coach.specialties.join(", ")}</p>
        )}
        {coach.lesson_types && coach.lesson_types.length > 0 && (
          <p className="text-zinc-400"><span className="text-zinc-500">Lessons:</span> {coach.lesson_types.join(", ")}</p>
        )}
        {coach.price_range && (
          <p className="text-zinc-400"><span className="text-zinc-500">Price:</span> {coach.price_range}</p>
        )}
        {coach.bio && (
          <p className="text-zinc-500 text-xs line-clamp-2">{coach.bio}</p>
        )}
        {coach.contact_email && (
          <p className="text-zinc-400"><span className="text-zinc-500">Email:</span> {coach.contact_email}</p>
        )}
        {coach.contact_phone && (
          <p className="text-zinc-400"><span className="text-zinc-500">Phone:</span> {coach.contact_phone}</p>
        )}
        {coach.website_url && (
          <p className="text-zinc-400"><span className="text-zinc-500">Web:</span> {coach.website_url}</p>
        )}
        {coach.instagram_url && (
          <p className="text-zinc-400"><span className="text-zinc-500">IG:</span> {coach.instagram_url}</p>
        )}
        {coach.rink_affiliations && coach.rink_affiliations.length > 0 && (
          <p className="text-zinc-400"><span className="text-zinc-500">Rinks:</span> {coach.rink_affiliations.join(", ")}</p>
        )}
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {!coach.approved && (
          <button
            onClick={() => onAction(coach.id, "approve")}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-all active:scale-95 inline-flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Approve
          </button>
        )}
        <button
          onClick={() => onAction(coach.id, "feature")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 inline-flex items-center gap-1 ${
            coach.featured
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
              : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:text-zinc-300"
          }`}
        >
          <Star className="w-3.5 h-3.5" /> {coach.featured ? "Unfeature" : "Feature"}
        </button>
        <Link
          href={`/coaching/${coach.slug}`}
          className="px-3 py-1.5 rounded-lg bg-zinc-800/50 text-zinc-400 text-xs font-medium border border-zinc-700/50 hover:text-zinc-300 transition-all inline-flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View
        </Link>
        <button
          onClick={() => {
            if (confirm(`Remove ${coach.name}? This cannot be undone.`)) {
              onAction(coach.id, "delete");
            }
          }}
          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 hover:bg-red-500/30 transition-all active:scale-95 inline-flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>
    </div>
  );
}

export default function CoachingAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pending, setPending] = useState<Coach[]>([]);
  const [approved, setApproved] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Check localStorage for saved key
  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (saved) {
      setAdminKey(saved);
      verifyKey(saved);
    }
  }, []);

  async function verifyKey(key: string) {
    try {
      const res = await fetch("/api/coaches/admin/pending", {
        headers: { "X-Admin-Key": key },
      });
      if (res.ok) {
        setIsAuthed(true);
        setAuthError(null);
        localStorage.setItem(ADMIN_KEY_STORAGE, key);
        loadCoaches(key);
      } else {
        setIsAuthed(false);
        setAuthError("Invalid admin key");
        localStorage.removeItem(ADMIN_KEY_STORAGE);
      }
    } catch {
      setAuthError("Connection error");
    }
  }

  async function loadCoaches(key: string) {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch("/api/coaches/admin/pending", { headers: { "X-Admin-Key": key } }),
        fetch("/api/coaches"),
      ]);
      if (pendingRes.ok) setPending(await pendingRes.json());
      if (allRes.ok) {
        const all: Coach[] = await allRes.json();
        setApproved(all.filter((c) => Array.isArray(all) ? true : false));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function notifyCoachApproved(coach: Coach) {
    if (!coach.contact_email) return;
    const profileUrl = `https://puckfinder.hockey/coaching/${coach.slug}`;
    const notifData = new FormData();
    notifData.append("name", coach.name);
    notifData.append("email", coach.contact_email);
    notifData.append(
      "message",
      `Hi ${coach.name},

Great news — your coaching profile has been approved and is now live on PuckFinder! 🎉

${profileUrl}

Players can now find you, view your specialties, and reach out to book lessons.

Thanks for joining PuckFinder!

— Ryan & the PuckFinder team`
    );
    try {
      await fetch("https://formspree.io/f/xnjljrrn", {
        method: "POST",
        body: notifData,
        headers: { Accept: "application/json" },
      });
    } catch {
      // Notification failure shouldn't block the approval
    }
  }

  async function handleAction(coachId: number, action: string) {
    setActionLoading(coachId);
    const key = adminKey;
    try {
      let res: Response;
      if (action === "delete") {
        res = await fetch(`/api/coaches/admin/${coachId}/delete`, {
          method: "DELETE",
          headers: { "X-Admin-Key": key },
        });
      } else {
        res = await fetch(`/api/coaches/admin/${coachId}/${action}`, {
          method: "PUT",
          headers: { "X-Admin-Key": key },
        });
      }
      if (res.ok || res.status === 204) {
        if (action === "approve") {
          const coach = pending.find((c) => c.id === coachId) ?? approved.find((c) => c.id === coachId);
          if (coach) await notifyCoachApproved(coach);
        }
        loadCoaches(key);
      } else {
        alert(`Action failed: ${res.status}`);
      }
    } catch {
      alert("Connection error");
    }
    setActionLoading(null);
  }

  // Login screen
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <h1 className="text-xl font-bold text-center mb-2 inline-flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-zinc-400" /> Coach Admin
          </h1>
          <p className="text-sm text-zinc-500 text-center mb-6">Enter your admin key to manage coach applications.</p>
          {authError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400 mb-4">
              {authError}
            </div>
          )}
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verifyKey(adminKey)}
            placeholder="Admin API key"
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm mb-4"
          />
          <button
            onClick={() => verifyKey(adminKey)}
            className="w-full px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all active:scale-[0.98]"
          >
            Unlock
          </button>
          <Link
            href="/coaching"
            className="block text-center mt-4 text-sm text-zinc-500 hover:text-zinc-400 transition"
          >
            ← Back to coaches
          </Link>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <SiteHeader size="sm">
        <div className="flex items-center gap-2">
          <Link
            href="/coaching"
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 text-xs font-medium text-zinc-300 border border-zinc-700/50 hover:bg-zinc-700/80 transition"
          >
            ← Coaches
          </Link>
          <button
            onClick={() => { setIsAuthed(false); setAdminKey(""); localStorage.removeItem(ADMIN_KEY_STORAGE); }}
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 text-xs font-medium text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/80 transition"
          >
            Lock
          </button>
        </div>
      </SiteHeader>

      <main className="flex-1 max-w-2xl mx-auto px-4 pb-24 safe-bottom w-full">
        {/* Pending */}
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 px-1">
            Pending ({pending.length})
          </h2>
          {loading ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="text-zinc-600 text-sm py-4 text-center">No pending applications</p>
          ) : (
            <div className="space-y-3">
              {pending.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onAction={actionLoading ? () => {} : handleAction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Approved */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 px-1">
            Approved ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p className="text-zinc-600 text-sm py-4 text-center">No approved coaches yet</p>
          ) : (
            <div className="space-y-3">
              {approved.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onAction={actionLoading ? () => {} : handleAction}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-zinc-600 text-[11px] py-6 border-t border-zinc-900 safe-bottom">
        <p>PuckFinder Admin</p>
      </footer>
    </div>
  );
}