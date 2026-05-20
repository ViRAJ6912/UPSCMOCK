"use client";

import { motion } from "framer-motion";
import type { TestResult } from "@/types";
import { formatTime } from "@/lib/scoring";

interface Props {
  result: TestResult;
}

export function ResultSummary({ result }: Props) {
  const r = result;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <BigCard
        label="Final Score"
        value={`${r.finalScore}`}
        sub={`out of ${r.maxMarks} (${r.percent}%)`}
      />
      <Card label="Correct" value={r.correct} sub={`+${r.correctMarks.toFixed(2)} marks`} tone="ok" />
      <Card label="Wrong" value={r.wrong} sub={`−${r.deduction.toFixed(2)} marks`} tone="bad" />
      <Card label="Unattempted" value={r.skipped} sub="0 marks" tone="warn" />
      <Card label="Accuracy" value={`${r.accuracy}%`} sub="on attempted" />
      <Card label="Time Used" value={formatTime(r.timeUsedSec)} sub={`of ${formatTime(r.durationSec)}`} />
    </div>
  );
}

function BigCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-2 lg:col-span-1 bg-gradient-to-br from-accent to-accent-dark text-white rounded-2xl p-5 shadow-card"
    >
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="font-serif text-3xl font-bold mt-1">{value}</div>
      <div className="text-xs opacity-90 mt-0.5">{sub}</div>
    </motion.div>
  );
}

function Card({
  label, value, sub, tone = "neutral",
}: {
  label: string;
  value: string | number;
  sub: string;
  tone?: "neutral" | "ok" | "bad" | "warn";
}) {
  const accent =
    tone === "ok" ? "text-ok"
      : tone === "bad" ? "text-bad"
      : tone === "warn" ? "text-warn"
      : "text-ink";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl p-4 border border-black/5 shadow-card"
    >
      <div className="text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
      <div className={`font-serif text-2xl font-bold mt-1 ${accent}`}>{value}</div>
      <div className="text-xs text-ink-mute mt-0.5">{sub}</div>
    </motion.div>
  );
}
