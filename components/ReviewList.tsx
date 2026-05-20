"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ReviewItem } from "@/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "wrong" | "correct" | "skip";

interface Props {
  items: ReviewItem[];
}

export function ReviewList({ items }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = items.filter((it) => filter === "all" || it.status === filter);

  const counts = {
    all: items.length,
    correct: items.filter((i) => i.status === "correct").length,
    wrong: items.filter((i) => i.status === "wrong").length,
    skip: items.filter((i) => i.status === "skip").length,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All ({counts.all})</Chip>
        <Chip active={filter === "wrong"} onClick={() => setFilter("wrong")} tone="bad">Wrong ({counts.wrong})</Chip>
        <Chip active={filter === "correct"} onClick={() => setFilter("correct")} tone="ok">Correct ({counts.correct})</Chip>
        <Chip active={filter === "skip"} onClick={() => setFilter("skip")} tone="warn">Unattempted ({counts.skip})</Chip>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-sm text-ink-mute py-6 text-center">No questions in this filter.</div>
        )}
        {filtered.map((it) => (
          <ReviewRow key={it.index} item={it} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  active, onClick, tone = "neutral", children,
}: {
  active: boolean;
  onClick: () => void;
  tone?: "neutral" | "ok" | "bad" | "warn";
  children: React.ReactNode;
}) {
  const palette = {
    neutral: active ? "bg-ink text-white border-ink" : "bg-white text-ink-soft border-black/10",
    ok: active ? "bg-ok text-white border-ok" : "bg-white text-ok border-ok/30",
    bad: active ? "bg-bad text-white border-bad" : "bg-white text-bad border-bad/30",
    warn: active ? "bg-warn text-white border-warn" : "bg-white text-warn border-warn/30",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full border text-xs font-semibold transition",
        palette[tone],
      )}
    >
      {children}
    </button>
  );
}

function ReviewRow({ item }: { item: ReviewItem }) {
  const [open, setOpen] = useState(false);
  const { question, userAns, status, index } = item;
  const tone =
    status === "correct" ? "border-ok/30 bg-ok/[0.03]"
      : status === "wrong" ? "border-bad/30 bg-bad/[0.03]"
      : "border-black/10 bg-paper/40";
  const tag =
    status === "correct" ? { cls: "bg-ok/10 text-ok", label: "Correct" }
      : status === "wrong" ? { cls: "bg-bad/10 text-bad", label: "Wrong" }
      : { cls: "bg-ink/10 text-ink-soft", label: "Unattempted" };

  return (
    <motion.div
      layout
      className={cn("rounded-xl border p-4", tone)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 text-left"
      >
        <span className="font-bold text-ink shrink-0">Q{index + 1}.</span>
        <span className="flex-1">
          <span className="text-sm text-ink line-clamp-2 prose-q">{question.question}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
            <span className={cn("px-2 py-0.5 rounded-full font-semibold", tag.cls)}>{tag.label}</span>
            <span className="text-ink-mute">Subject: {question.subject}</span>
            <span className="text-ink-mute">
              Your answer: <strong className="text-ink">{userAns ?? "—"}</strong>
            </span>
            <span className="text-ink-mute">
              Correct: <strong className="text-ok">{question.correct}</strong>
            </span>
          </span>
        </span>
        <span className="text-ink-mute text-xs mt-0.5">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden"
        >
          <div className="mt-4 grid gap-1.5">
            {(["A", "B", "C", "D"] as const).map((k) => {
              const isCorrect = k === question.correct;
              const isUserWrong = userAns === k && k !== question.correct;
              return (
                <div
                  key={k}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm",
                    isCorrect && "bg-ok/10 border-ok/40 text-ok",
                    isUserWrong && "bg-bad/10 border-bad/40 text-bad",
                    !isCorrect && !isUserWrong && "border-black/10 bg-white text-ink",
                  )}
                >
                  <span className="font-bold mr-2">{k}.</span>
                  {question.options[k]}
                </div>
              );
            })}
          </div>
          <div className="mt-3 bg-gold/10 border-l-4 border-gold rounded-md px-4 py-3 text-sm text-ink-soft">
            <div className="font-semibold text-ink mb-1">Explanation</div>
            {question.explanation}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
