"use client";

import { motion } from "framer-motion";
import { formatTime } from "@/lib/scoring";

interface Props {
  remaining: number;
  duration: number;
}

export function Timer({ remaining, duration }: Props) {
  const tone = remaining <= 120 ? "danger" : remaining <= 600 ? "warn" : "ok";
  const color = tone === "danger" ? "text-bad" : tone === "warn" ? "text-warn" : "text-ink";
  const ring = tone === "danger" ? "ring-bad/40" : tone === "warn" ? "ring-warn/40" : "ring-ink/10";
  return (
    <div className={`bg-ink text-white rounded-xl p-3 ring-1 ${ring}`}>
      <div className="text-[10px] tracking-widest uppercase opacity-70">Time Remaining</div>
      <motion.div
        key={tone}
        initial={{ scale: 1 }}
        animate={tone === "danger" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: tone === "danger" ? Infinity : 0 }}
        className={`font-serif text-2xl font-bold tracking-tight ${color === "text-bad" ? "text-red-300" : color === "text-warn" ? "text-amber-300" : "text-white"}`}
      >
        {formatTime(remaining)}
      </motion.div>
      <ProgressBar pct={Math.max(0, Math.min(100, (remaining / duration) * 100))} tone={tone} />
    </div>
  );
}

function ProgressBar({ pct, tone }: { pct: number; tone: "ok" | "warn" | "danger" }) {
  const bar = tone === "danger" ? "bg-red-400" : tone === "warn" ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${bar} transition-[width] duration-1000 ease-linear`} style={{ width: `${pct}%` }} />
    </div>
  );
}
