"use client";

import Link from "next/link";
import { ReactNode } from "react";

type SiteHeaderProps = {
  children?: ReactNode;
  size?: "sm" | "md";
};

export default function SiteHeader({ children, size = "md" }: SiteHeaderProps) {
  const logoSize = size === "sm" ? "w-6 h-6" : "w-7 h-7";
  return (
    <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/80 safe-top">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="PuckFinder" className={logoSize} />
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-tight">
              <span className="text-blue-400">Puck</span>Finder
            </h1>
          </div>
        </Link>
        {children}
      </div>
    </header>
  );
}
