"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Result {
  paper: string;
  answers: Record<number, string>;
  questions: { subject: string; correct: string }[];
  timeUsed: number;
  submittedAt: number;
}

const SCORING: Record<string, { correct: number; wrong: number }> = {
  gs1: { correct: 2, wrong: -0.66 },
  csat1: { correct: 2.5, wrong: -0.83 },
};

function calcScore(r: Result) {
  const s = SCORING[r.paper] || SCORING.gs1;
  let score = 0;
  r.questions.forEach((q, i) => {
    if (r.answers[i] === undefined) return;
    score += r.answers[i] === q.correct ? s.correct : s.wrong;
  });
  return score;
}

export default function Dashboard() {
  const [history, setHistory] = useState<Result[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("upsc_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  if (history.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-zinc-600 dark:text-zinc-400">
        <p>No tests attempted yet.</p>
        <Link href="/" className="text-sm underline">Start a test</Link>
      </div>
    );
  }

  const scores = history.map(calcScore);
  const best = Math.max(...scores);
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

  // Weak subjects
  const subjectStats: Record<string, { correct: number; total: number }> = {};
  history.forEach((r) => {
    r.questions.forEach((q, i) => {
      if (!subjectStats[q.subject]) subjectStats[q.subject] = { correct: 0, total: 0 };
      subjectStats[q.subject].total++;
      if (r.answers[i] === q.correct) subjectStats[q.subject].correct++;
    });
  });

  const subjectData = Object.entries(subjectStats)
    .map(([name, d]) => ({ name, accuracy: Math.round((d.correct / d.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakSubjects = subjectData.filter((s) => s.accuracy < 50);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <Link href="/" className="text-sm text-zinc-600 underline dark:text-zinc-400">Home</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Tests Attempted</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{history.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Best Score</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{best.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Average Score</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{avg}</p>
          </div>
        </div>

        {/* Subject Accuracy Chart */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject-wise Accuracy</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weak Subjects */}
        {weakSubjects.length > 0 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Weak Subjects (below 50% accuracy)</p>
            <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
              {weakSubjects.map((s) => <li key={s.name}>{s.name} — {s.accuracy}%</li>)}
            </ul>
          </div>
        )}

        {/* Recent Attempts */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Recent Attempts</p>
          <div className="space-y-2">
            {history.slice(-10).reverse().map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.paper === "gs1" ? "GS Paper I" : "CSAT Paper II"}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(r.submittedAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{calcScore(r).toFixed(2)} marks</p>
              </div>
            ))}
          </div>
        </div>

        <Link href="/" className="mt-8 inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">← Back to Home</Link>
      </div>
    </div>
  );
}
