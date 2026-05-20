"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { OptionKey, Question } from "@/types";
import { cn } from "@/lib/cn";

interface Props {
  index: number;
  total: number;
  question: Question;
  selected: OptionKey | null;
  marked: boolean;
  onSelect: (key: OptionKey) => void;
}

const KEYS: OptionKey[] = ["A", "B", "C", "D"];

export function QuestionCard({ index, total, question, selected, marked, onSelect }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.2 }}
        className="bg-surface rounded-2xl border border-black/5 shadow-card p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
            Question {index + 1} <span className="opacity-60">of {total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-paper text-ink-soft">
              {question.subject}
            </span>
            {marked && (
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-review/10 text-review">
                Marked
              </span>
            )}
          </div>
        </div>

        <div className="prose-q text-ink text-[15px] sm:text-base">{question.question}</div>

        <div className="mt-5 flex flex-col gap-2.5">
          {KEYS.map((k) => {
            const isSel = selected === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => onSelect(k)}
                className={cn(
                  "w-full flex gap-3 items-start text-left rounded-xl border px-4 py-3 transition",
                  isSel
                    ? "border-accent bg-accent/[0.04]"
                    : "border-black/10 hover:border-accent/50 bg-white",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full border text-[12px] font-bold shrink-0",
                    isSel ? "bg-accent text-white border-accent" : "border-black/20 text-ink-soft",
                  )}
                >
                  {k}
                </span>
                <span className="text-[15px] text-ink leading-relaxed">{question.options[k]}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
