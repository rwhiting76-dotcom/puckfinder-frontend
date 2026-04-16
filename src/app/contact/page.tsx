"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xnjljrrn", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="text-2xl">🏒</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">
                <span className="text-blue-400">Puck</span>Finder
              </h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-2">Contact Us</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Questions, suggestions, or found a bug? Drop us a note.
        </p>

        {status === "sent" ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-emerald-400 font-medium">Message sent!</p>
            <p className="text-zinc-400 text-sm mt-1">We&apos;ll get back to you soon.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-zinc-400 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-zinc-400 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="What's on your mind?"
              />
            </div>
            {status === "error" && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to sessions
          </Link>
        </div>
      </main>
    </div>
  );
}