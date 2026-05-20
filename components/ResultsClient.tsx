"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { TestResult } from "@/types";
import { loadResult } from "@/lib/storage";
import { ResultSummary } from "./ResultSummary";
import { PerformancePie } from "./PerformancePie";
import { SubjectAnalysis } from "./SubjectAnalysis";
import { ReviewList } from "./ReviewList";
import { StatusPill } from "./StatusPill";

export function ResultsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const paperId = params.get("paper");
  const [result, setResult] = useState<TestResult | null | "loading">("loading");

  useEffect(() => {
    if (!paperId) {
      setResult(null);
      return;
    }
    setResult(loadResult(paperId));
  }, [paperId]);

  const tone = useMemo(() => {
    if (!result || result === "loading") return "info" as const;
    if (result.type === "csat" && result.pass != null) return result.pass ? ("ok" as const) : ("bad" as const);
    return result.category === "Excellent" || result.category === "Good" ? ("ok" as const) : result.category === "Average" ? ("info" as const) : ("bad" as const);
  }, [result]);

  if (result === "loading") {
    return <div className="text-ink-mute py-12 text-center">Loading result…</div>;
  }

  if (!result) {
    return (
      <div className="bg-surface border border-black/5 rounded-2xl p-8 text-center shadow-card">
        <h1 className="font-serif text-2xl text-ink mb-2">No result found</h1>
        <p className="text-ink-soft mb-4">
          {paperId ? "This paper hasn't been completed yet on this device." : "No paper specified."}
        </p>
        <Link href="/" className="inline-block bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark transition">
          Go to Home
        </Link>
      </div>
    );
  }

  const passLabel =
    result.type === "csat" && result.pass != null
      ? (result.pass ? `Qualified (≥ ${result.qualifying} marks)` : `Not Qualified (< ${result.qualifying} marks)`)
      : null;

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 justify-between"
      >
        <div>
          <h1 className="font-serif text-3xl text-ink">{result.paperName} — Result</h1>
          <p className="text-sm text-ink-mute">
            Completed {new Date(result.completedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {passLabel && <StatusPill tone={tone}>{passLabel}</StatusPill>}
          <StatusPill tone={tone}>Performance: {result.category}</StatusPill>
        </div>
      </motion.header>

      <ResultSummary result={result} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-4">
        <Panel title="Distribution">
          <PerformancePie correct={result.correct} wrong={result.wrong} skipped={result.skipped} />
          <ul className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <Legend dot="bg-ok" label="Correct" value={result.correct} />
            <Legend dot="bg-bad" label="Wrong" value={result.wrong} />
            <Legend dot="bg-slate-400" label="Skipped" value={result.skipped} />
          </ul>
        </Panel>

        <Panel title="Subject-wise Analysis">
          <SubjectAnalysis subjects={result.subjects} />
        </Panel>

        <Panel title="Indicative Rank Band">
          <div className="font-serif text-2xl text-accent font-bold leading-snug">
            {result.rankBand}
          </div>
          <p className="text-xs text-ink-mute mt-3 leading-relaxed">
            Indicative only. Based on a synthetic distribution loosely calibrated against publicly-known
            historical UPSC Prelims cutoff ranges. Actual cutoffs vary year to year.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <Mini label="Negative Marks" value={`−${result.deduction.toFixed(2)}`} tone="bad" />
            <Mini label="Net Score" value={`${result.finalScore}`} />
            <Mini label="Max Marks" value={`${result.maxMarks}`} />
            <Mini label="Percentage" value={`${result.percent}%`} />
          </div>
        </Panel>
      </div>

      <Panel title="Detailed Review">
        <ReviewList items={result.review} />
      </Panel>

      <div className="flex justify-end gap-2">
        <Link href="/dashboard" className="px-4 py-2 text-sm font-medium rounded-lg border border-black/10 text-ink-soft hover:bg-paper transition">
          Dashboard
        </Link>
        <Link href="/" className="px-4 py-2 text-sm font-medium rounded-lg border border-black/10 text-ink-soft hover:bg-paper transition">
          Home
        </Link>
        <button
          type="button"
          onClick={() => router.push(`/test/${result.paperId}`)}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-dark transition"
        >
          Retake Paper
        </button>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-black/5 rounded-2xl p-5 shadow-card">
      <h3 className="font-semibold text-ink mb-3">{title}</h3>
      {children}
    </section>
  );
}

function Legend({ dot, label, value }: { dot: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
      <span className="text-ink-soft">{label}</span>
      <span className="ml-auto font-bold">{value}</span>
    </li>
  );
}

function Mini({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "bad" }) {
  const cls = tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className="bg-paper rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
      <div className={`font-serif text-base font-bold ${cls}`}>{value}</div>
    </div>
  );
}
