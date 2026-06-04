import { Suspense } from "react";
import LeaderboardPageClient from "@/app/leaderboard/LeaderboardPageClient";

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
