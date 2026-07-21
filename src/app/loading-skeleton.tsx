"use client";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="PuckFinder" className="w-9 h-9" />
            <div>
              <div className="h-4 w-28 bg-zinc-800 rounded" />
              <div className="h-2.5 w-36 bg-zinc-800/60 rounded mt-1.5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-16 bg-zinc-800 rounded-lg" />
            <div className="h-7 w-16 bg-zinc-800 rounded-lg" />
            <div className="h-7 w-20 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-[57px] z-10 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 py-2 flex gap-1.5 overflow-x-auto">
          <div className="h-7 w-12 bg-zinc-800 rounded-lg shrink-0" />
          <div className="h-7 w-24 bg-zinc-800 rounded-lg shrink-0" />
          <div className="h-7 w-28 bg-zinc-800 rounded-lg shrink-0" />
          <div className="h-7 w-20 bg-zinc-800 rounded-lg shrink-0" />
          <div className="h-7 w-32 bg-zinc-800 rounded-lg shrink-0" />
        </div>
      </div>

      {/* Body */}
      <main className="flex-1 max-w-2xl mx-auto px-4 pb-24 w-full">
        {/* Wake-up hint */}
        <div className="text-center py-8 px-6">
          <div className="inline-flex items-center gap-2 text-zinc-400 text-base font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
            Finding stick & puck times…
          </div>
          <p className="text-zinc-600 text-sm mt-2">Hang tight — first load wakes the server.</p>
        </div>

        {/* Date groups */}
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mt-5">
              <div className="flex items-baseline justify-between mb-2 px-1">
                <div className="h-4 w-24 bg-zinc-800 rounded" />
                <div className="h-3 w-16 bg-zinc-800/60 rounded" />
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <div className="h-4 w-14 bg-zinc-800 rounded" />
                    <div className="h-4 w-40 bg-zinc-800 rounded" />
                  </div>
                  <div className="h-3 w-48 bg-zinc-800/60 rounded mt-2" />
                </div>
                <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/60 px-3 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <div className="h-4 w-14 bg-zinc-800 rounded" />
                    <div className="h-4 w-32 bg-zinc-800 rounded" />
                  </div>
                  <div className="h-3 w-44 bg-zinc-800/60 rounded mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
