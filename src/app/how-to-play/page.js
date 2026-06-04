import { Suspense } from "react";
import HowToPlayPageClient from "@/app/how-to-play/HowToPlayPageClient";

function HowToPlayPageFallback() {
  return <div className="min-h-[40vh]" aria-hidden />;
}

export default function HowToPlayPage() {
  return (
    <Suspense fallback={<HowToPlayPageFallback />}>
      <HowToPlayPageClient />
    </Suspense>
  );
}
