import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hockey Coaches — PuckFinder",
  description: "Find private and group hockey coaching in the Salt Lake City area. Power skating, stick handling, goalie, and more.",
};

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}