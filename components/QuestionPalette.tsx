"use client";

import { cn } from "@/lib/cn";

interface Props {
  total: number;
  current: number;
  answers: Array<string | null>;
  marked: boolean[];
  visited: boolean[];
  onJump: (idx: number) => void;
}

export function QuestionPalette({ total, current, answers, marked, visited, onJump }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
      {Array.from({ length: total }, (_, i) => {
        const hasAns = answers[i] != null;
        const isMarked = marked[i];
        const isVis = visited[i];

        // UPSC-style status colors:
        // grey → not visited, red → unanswered (visited), green → answered, purple → marked
        let cls = "bg-paper text-ink-soft border-black/10"; // grey / unseen
        if (isMarked) cls = "bg-review text-white border-review";
        else if (hasAns) cls = "bg-ok text-white border-ok";
        else if (isVis) cls = "bg-bad text-white border-bad";

        const isCurrent = i === current;

        return (
          <button
            key={i}
            type="button"
            aria-label={`Go to question ${i + 1}`}
            onClick={() => onJump(i)}
            className={cn(
              "aspect-square rounded-md border text-[12px] font-bold transition",
              cls,
              isCurrent && "ring-2 ring-accent ring-offset-1",
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
