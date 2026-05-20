"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { type HistoryEntry, clearAllHistory, loadAllHistory } from "@/lib/storage";
import { formatTimeShort } from "@/lib/scoring";

export function DashboardClient() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(loadAllHistory());
    setLoaded(true);
  }, []);

  const stats = useMemo(() => {
    if (!history.length) return null;
    const total = history.length;
    const sum = history.reduce((a, h) => a + h.finalScore, 0);
    const max = history.reduce((m, h) => Math.max(m, h.finalScore), -Infinity);
    const best = history.find((h) => h.finalScore === max)!;
    const avg = Math.round((sum / total) * 100) / 100;
    const csatPasses = history.filter((h) => h.type === "csat" && h.pass === true).length;
    const csatAttempts = history.filter((h) => h.type === "csat").length;
    return { total, avg, best, csatPasses, csatAttempts };
  }, [history]);

  const weakSubjects = useMemo(() => {
    // We don't store subject data per attempt in history (kept lean). Use latest result if present.
    return [] as Array<{ subject: string; accuracy: number; total: number }>;
  }, []);

  if (!loaded) return <div className="text-ink-mute py-12 text-center">Loading dashboard…</div>;

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-black/5 rounded-2xl p-10 text-center shadow-card"
      >
        <h1 className="font-serif text-2xl text-ink mb-2">No attempts yet</h1>
        <p className="text-ink-soft mb-5">Take a mock test and your stats will appear here.</p>
        <Link href="/" className="inline-block bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark transition">
          Browse Papers
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">Your Dashboard</h1>
          <p className="text-sm text-ink-mute">Aggregated stats across all attempts on this device.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all attempt history? This cannot be undone.")) {
              clearAllHistory();
              setHistory([]);
            }
          }}
          className="text-xs font-medium text-ink-mute hover:text-bad transition"
        >
          Clear History
        </button>
      </header>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Total Attempts" value={String(stats.total)} />
          <Stat label="Average Score" value={stats.avg.toFixed(2)} sub="across all attempts" />
          <Stat label="Best Score" value={stats.best.finalScore.toFixed(2)} sub={stats.best.paperName} tone="ok" />
          <Stat
            label="CSAT Qualified"
            value={`${stats.csatPasses}/${stats.csatAttempts}`}
            sub="of CSAT attempts"
            tone={stats.csatPasses > 0 ? "ok" : "warn"}
          />
        </div>
      )}

      <section className="bg-surface border border-black/5 rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-black/5">
          <h3 className="font-semibold text-ink">Recent Attempts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper text-[11px] uppercase tracking-wider text-ink-mute">
              <tr>
                <Th>Paper</Th>
                <Th>Score</Th>
                <Th>Accuracy</Th>
                <Th>Correct / Wrong / Skip</Th>
                <Th>Time</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-t border-black/5 hover:bg-paper/40 transition">
                  <Td>
                    <div className="font-semibold text-ink">{h.paperName}</div>
                    <div className="text-[11px] text-ink-mute uppercase tracking-wider">{h.type}</div>
                  </Td>
                  <Td>
                    <span className="font-serif text-base font-bold">{h.finalScore.toFixed(2)}</span>
                    <span className="text-ink-mute"> / {h.maxMarks}</span>
                  </Td>
                  <Td>{h.accuracy}%</Td>
                  <Td className="text-xs">
                    <span className="text-ok font-semibold">{h.correct}</span>{" / "}
                    <span className="text-bad font-semibold">{h.wrong}</span>{" / "}
                    <span className="text-ink-mute">{h.skipped}</span>
                  </Td>
                  <Td className="text-xs">{formatTimeShort(h.timeUsedSec)}</Td>
                  <Td>
                    {h.type === "csat" && h.pass != null ? (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${h.pass ? "bg-ok/10 text-ok" : "bg-bad/10 text-bad"}`}>
                        {h.pass ? "Qualified" : "Not Qualified"}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-paper text-ink-soft">
                        {h.category}
                      </span>
                    )}
                  </Td>
                  <Td className="text-xs text-ink-mute">{new Date(h.completedAt).toLocaleDateString()}</Td>
                  <Td>
                    <Link
                      href={`/results?paper=${h.paperId}`}
                      className="text-accent text-xs font-semibold hover:underline"
                    >
                      View
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {weakSubjects.length > 0 && (
        <section className="bg-surface border border-black/5 rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-ink mb-3">Areas to Improve</h3>
          <ul className="text-sm text-ink-soft space-y-1.5">
            {weakSubjects.map((s) => (
              <li key={s.subject}>{s.subject}: {s.accuracy.toFixed(0)}% accuracy</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({
  label, value, sub, tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "ok" | "warn";
}) {
  const cls =
    tone === "ok" ? "text-ok"
      : tone === "warn" ? "text-warn"
      : "text-ink";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-black/5 rounded-2xl p-4 shadow-card"
    >
      <div className="text-[10px] uppercase tracking-wider text-ink-mute">{label}</div>
      <div className={`font-serif text-2xl font-bold mt-1 ${cls}`}>{value}</div>
      {sub && <div className="text-xs text-ink-mute mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left px-4 py-2.5 font-semibold">{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
