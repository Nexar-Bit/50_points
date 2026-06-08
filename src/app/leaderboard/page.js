import { Suspense } from "react";
import LeaderboardPageClient from "@/app/leaderboard/LeaderboardPageClient";
import { buildPageMetadata } from "@/frontend/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Leaderboard",
  description:
    "Live global and tournament leaderboards. Track points, win rate, streaks, and rising players on 50points.",
  path: "/leaderboard",
  keywords: ["leaderboard", "rankings", "points", "horse racing tournament"],
});

function LeaderboardPageFallback() {
  return <div className="min-h-[50vh]" aria-hidden />;
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardPageFallback />}>
      <LeaderboardPageClient />
    </Suspense>
  );
}
