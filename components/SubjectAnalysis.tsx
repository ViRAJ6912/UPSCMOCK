"use client";

import type { SubjectStat } from "@/types";

interface Props {
  subjects: SubjectStat[];
}

export function SubjectAnalysis({ subjects }: Props) {
  return (
    <ul className="flex flex-col gap-3">
      {subjects.map((s) => {
        const accuracy = s.correct + s.wrong === 0 ? 0 : (s.correct / (s.correct + s.wrong)) * 100;
        return (
          <li key={s.subject}>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-sm text-ink">{s.subject}</span>
              <span className="text-xs text-ink-mute">
                {s.correct}/{s.total} correct · {accuracy.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1.5 h-2 bg-paper rounded-full overflow-hidden">
              <div
                className="h-full bg-ok transition-[width] duration-500"
                style={{ width: `${(s.correct / Math.max(s.total, 1)) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-ink-mute mt-1">
              <span className="text-ok font-medium">{s.correct} correct</span>
              {" · "}
              <span className="text-bad font-medium">{s.wrong} wrong</span>
              {" · "}
              <span>{s.skipped} skipped</span>
              {" · "}
              <span className="font-medium text-ink">{s.scored.toFixed(2)} marks</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
