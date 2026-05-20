"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PaperMeta } from "@/types";
import { formatTimeShort } from "@/lib/scoring";

interface Props {
  paper: PaperMeta;
  index?: number;
}

export function PaperCard({ paper, index = 0 }: Props) {
  const isGs = paper.type === "gs";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="bg-surface rounded-2xl border border-black/5 shadow-card p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span
          className={[
            "inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full",
            isGs ? "bg-accent/10 text-accent" : "bg-info/10 text-info",
          ].join(" ")}
        >
          {isGs ? "General Studies" : "CSAT (Aptitude)"}
        </span>
        <span className="text-[11px] font-medium text-ink-mute uppercase tracking-wider">
          {paper.difficulty}
        </span>
      </div>

      <div>
        <h3 className="font-serif text-xl text-ink">{paper.name}</h3>
        <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">{paper.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5">
        <Stat label="Questions" value={String(paper.total)} />
        <Stat label="Marks" value={String(paper.marks)} />
        <Stat label="Duration" value={formatTimeShort(paper.durationSec)} />
      </div>

      <div className="text-xs text-ink-mute">
        Marking:{" "}
        <span className="font-semibold text-ink">+{paper.perCorrect}</span> correct ·{" "}
        <span className="font-semibold text-bad">{paper.perWrong}</span> wrong
        {paper.qualifying != null && (
          <>
            {" "}· Qualifying:{" "}
            <span className="font-semibold text-ink">{paper.qualifying} marks</span>
          </>
        )}
      </div>

      <Link
        href={`/test/${paper.id}`}
        className="mt-1 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark transition text-white font-semibold text-sm py-3 rounded-xl"
      >
        Start Test
        <span aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">{label}</div>
      <div className="font-serif text-lg text-ink mt-0.5">{value}</div>
    </div>
  );
}
