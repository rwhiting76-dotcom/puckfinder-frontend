import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PuckFinder — Stick & Puck Ice Time",
  description:
    "Find stick & puck and drop-in hockey sessions across Salt Lake City area rinks. Updated daily.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "PuckFinder",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "PuckFinder — Stick & Puck Ice Time",
    description:
      "Find stick & puck and drop-in hockey sessions across SLC area rinks.",
    type: "website",
    siteName: "PuckFinder",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="708def64-73a8-4736-81fd-520827bcb674"></script>
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}