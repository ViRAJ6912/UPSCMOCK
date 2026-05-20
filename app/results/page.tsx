import { Suspense } from "react";
import { ResultsClient } from "@/components/ResultsClient";

export const dynamic = "force-static";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="text-ink-mute py-12 text-center">Loading result…</div>}>
      <ResultsClient />
    </Suspense>
  );
}
