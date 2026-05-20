"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { OptionKey, PaperMeta, Question } from "@/types";
import { useTestState } from "@/hooks/useTestState";
import { useTimer } from "@/hooks/useTimer";
import { computeResult } from "@/lib/scoring";
import { saveResult } from "@/lib/storage";
import { Timer } from "./Timer";
import { QuestionCard } from "./QuestionCard";
import { QuestionPalette } from "./QuestionPalette";
import { SubmitModal } from "./SubmitModal";

interface Props {
  paper: PaperMeta;
  questions: Question[];
}

export function TestRunner({ paper, questions }: Props) {
  const router = useRouter();
  const {
    hydrated,
    answers,
    marked,
    visited,
    currentIdx,
    initialRemaining,
    stats,
    selectAnswer,
    toggleMark,
    goTo,
    next,
    prev,
    persist,
    finalize,
  } = useTestState({ paper, questions });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // We need access to the timer's current remaining. Keep a ref-like state.
  const [tick, setTick] = useState(initialRemaining);
  useEffect(() => setTick(initialRemaining), [initialRemaining]);

  const handleSubmit = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    const used = paper.durationSec - Math.max(0, tick);
    const result = computeResult(paper, questions, answers, used);
    saveResult(paper.id, result);
    finalize();
    router.push(`/results?paper=${paper.id}`);
  }, [submitting, tick, paper, questions, answers, finalize, router]);

  const { remaining } = useTimer({
    initialSec: initialRemaining,
    paused: !hydrated || submitting,
    onTick: (sec) => {
      setTick(sec);
      // Persist roughly every 5 seconds.
      if (sec % 5 === 0) persist(sec);
    },
    onExpire: () => {
      setAutoSubmit(true);
      setConfirmOpen(true);
    },
  });

  // Persist tick on unload too.
  useEffect(() => {
    const handler = () => persist(remaining);
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [persist, remaining]);

  // When forced submit modal is shown, auto-confirm shortly.
  useEffect(() => {
    if (autoSubmit && confirmOpen && !submitting) {
      const id = window.setTimeout(() => handleSubmit(), 1200);
      return () => window.clearTimeout(id);
    }
  }, [autoSubmit, confirmOpen, submitting, handleSubmit]);

  const q = questions[currentIdx];
  const progressPct = useMemo(
    () => (stats.attempted / questions.length) * 100,
    [stats.attempted, questions.length],
  );

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-mute">
        Loading test…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-20 self-start space-y-4">
        <Timer remaining={remaining} duration={paper.durationSec} />

        <div className="bg-surface border border-black/5 rounded-xl p-4 shadow-card">
          <Legend stats={stats} total={questions.length} />
          <div className="my-3 h-px bg-black/5" />
          <QuestionPalette
            total={questions.length}
            current={currentIdx}
            answers={answers}
            marked={marked}
            visited={visited}
            onJump={goTo}
          />
          <button
            type="button"
            onClick={() => { setAutoSubmit(false); setConfirmOpen(true); }}
            className="mt-4 w-full bg-ok hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-sm transition"
          >
            Submit Test
          </button>
        </div>
      </aside>

      {/* Main */}
      <section className="space-y-4">
        <div className="bg-surface border border-black/5 rounded-xl px-5 py-4 shadow-card">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h1 className="font-serif text-xl text-ink">{paper.name}</h1>
              <div className="text-xs text-ink-mute mt-0.5">
                {paper.total} questions · {paper.marks} marks · +{paper.perCorrect} correct · {paper.perWrong} wrong
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Stat label="Attempted" value={stats.attempted} tone="ok" />
              <Stat label="Remaining" value={stats.remaining} tone="warn" />
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-paper rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>

        <QuestionCard
          index={currentIdx}
          total={questions.length}
          question={q}
          selected={answers[currentIdx]}
          marked={marked[currentIdx]}
          onSelect={(k: OptionKey) => selectAnswer(currentIdx, k)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => selectAnswer(currentIdx, null)}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-black/10 text-ink-soft hover:bg-paper transition"
          >
            Clear Response
          </button>
          <button
            type="button"
            onClick={() => toggleMark(currentIdx)}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg border transition ${
              marked[currentIdx]
                ? "bg-review text-white border-review hover:bg-violet-700"
                : "border-black/10 text-ink-soft hover:bg-paper"
            }`}
          >
            {marked[currentIdx] ? "Unmark Review" : "Mark for Review"}
          </button>
          <button
            type="button"
            onClick={next}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-black/10 text-ink-soft hover:bg-paper transition"
          >
            Skip
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={prev}
            disabled={currentIdx === 0}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-black/10 text-ink-soft hover:bg-paper transition disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={next}
            className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-dark transition"
          >
            Save &amp; Next
          </button>
        </div>
      </section>

      <SubmitModal
        open={confirmOpen}
        attempted={stats.attempted}
        total={questions.length}
        forced={autoSubmit}
        busy={submitting}
        onCancel={() => { if (!autoSubmit) setConfirmOpen(false); }}
        onConfirm={handleSubmit}
      />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" }) {
  const cls = tone === "ok" ? "text-ok" : "text-warn";
  return (
    <div className="text-right leading-tight">
      <div className="text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
      <div className={`font-serif text-lg font-bold ${cls}`}>{value}</div>
    </div>
  );
}

function Legend({
  stats,
  total,
}: {
  stats: { answered: number; markedOnly: number; markedAnswered: number; skipped: number; unseen: number };
  total: number;
}) {
  const items = [
    { dot: "bg-ok", label: "Answered", value: stats.answered + stats.markedAnswered },
    { dot: "bg-review", label: "Marked", value: stats.markedOnly + stats.markedAnswered },
    { dot: "bg-bad", label: "Unanswered", value: stats.skipped },
    { dot: "bg-paper border border-black/10", label: "Not visited", value: stats.unseen },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2 text-ink-soft">
          <span className={`w-2.5 h-2.5 rounded-full ${i.dot}`} />
          <span>{i.label}</span>
          <span className="ml-auto font-bold text-ink">{i.value}</span>
        </div>
      ))}
      <div className="col-span-2 text-[11px] text-ink-mute pt-1">Total: {total}</div>
    </div>
  );
}
