"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Status = "grey" | "red" | "green" | "purple";

interface Question {
  id: number;
  paper: string;
  subject: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
}

interface TestPageProps {
  title: string;
  paper: string;
  questions: Question[];
  totalTime: number; // seconds
}

export default function TestPage({ title, paper, questions, totalTime }: TestPageProps) {
  const router = useRouter();
  const storageKey = `upsc_${paper}`;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Status[]>(Array(questions.length).fill("grey"));
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [startTime] = useState(() => {
    if (typeof window === "undefined") return Date.now();
    const saved = localStorage.getItem(`${storageKey}_startTime`);
    if (saved) return parseInt(saved);
    const now = Date.now();
    localStorage.setItem(`${storageKey}_startTime`, now.toString());
    return now;
  });
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.answers) setAnswers(data.answers);
      if (data.statuses) setStatuses(data.statuses);
      if (data.current !== undefined) setCurrent(data.current);
    } else {
      setStatuses((s) => { const c = [...s]; if (c[0] === "grey") c[0] = "red"; return c; });
    }
    setHydrated(true);
  }, [storageKey]);

  // Save to localStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ answers, statuses, current }));
  }, [answers, statuses, current, storageKey, hydrated]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, totalTime - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        submitTest();
      }
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, totalTime]);

  const submitTest = useCallback(() => {
    const timeUsed = totalTime - timeLeft;
    const result = {
      paper,
      answers,
      statuses,
      questions,
      timeUsed,
      submittedAt: Date.now(),
    };
    localStorage.setItem(`${storageKey}_result`, JSON.stringify(result));

    // Save to history
    const history = JSON.parse(localStorage.getItem("upsc_history") || "[]");
    history.push(result);
    localStorage.setItem("upsc_history", JSON.stringify(history));

    // Clear test state
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_startTime`);

    router.push(`/results/${paper}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper, answers, statuses, questions, timeLeft, totalTime, storageKey, router]);

  function markVisited(index: number) {
    setStatuses((s) => { const c = [...s]; if (c[index] === "grey") c[index] = "red"; return c; });
  }

  function goTo(index: number) {
    markVisited(index);
    setCurrent(index);
  }

  function saveAndNext() {
    if (answers[current] !== undefined) {
      setStatuses((s) => { const c = [...s]; c[current] = "green"; return c; });
    }
    if (current < questions.length - 1) { const n = current + 1; setCurrent(n); markVisited(n); }
  }

  function skip() {
    if (current < questions.length - 1) { const n = current + 1; setCurrent(n); markVisited(n); }
  }

  function previous() { if (current > 0) setCurrent(current - 1); }

  function markForReview() {
    setStatuses((s) => { const c = [...s]; c[current] = "purple"; return c; });
    if (current < questions.length - 1) { const n = current + 1; setCurrent(n); markVisited(n); }
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const statusColors: Record<Status, string> = {
    grey: "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    red: "border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-400",
    green: "border-green-400 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-950 dark:text-green-400",
    purple: "border-purple-400 bg-purple-50 text-purple-700 dark:border-purple-500 dark:bg-purple-950 dark:text-purple-400",
  };

  const answered = Object.keys(answers).length;
  const q = questions[current];

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
          <span className={`font-mono text-sm font-medium ${timeLeft < 300 ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"}`}>{formatTime(timeLeft)}</span>
          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Attempted: {answered}/{questions.length}</span>
            <span>Remaining: {questions.length - answered}</span>
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-6xl">
          <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 lg:flex-row">
        <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Question {current + 1}</p>
          <p className="mt-3 text-zinc-900 dark:text-zinc-100">{q.question}</p>

          <div className="mt-6 space-y-3">
            {Object.entries(q.options).map(([key, value]) => (
              <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${answers[current] === key ? "border-zinc-900 bg-zinc-100 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100" : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"}`}>
                <input type="radio" name="answer" checked={answers[current] === key} onChange={() => setAnswers((a) => ({ ...a, [current]: key }))} className="accent-zinc-900 dark:accent-zinc-100" />
                {value}
              </label>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={previous} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">Previous</button>
            <button onClick={saveAndNext} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">Save &amp; Next</button>
            <button onClick={skip} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">Skip</button>
            <button onClick={markForReview} className="rounded-lg border border-amber-400 px-4 py-2 text-sm font-medium text-amber-700 dark:border-amber-500 dark:text-amber-400">Mark for Review</button>
            <button onClick={submitTest} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">Submit Test</button>
          </div>
        </div>

        <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:w-56">
          <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Question Navigator</p>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-medium ${i === current ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : ""} ${statusColors[statuses[i]]}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <p><span className="inline-block h-3 w-3 rounded border border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800" /> Not visited</p>
            <p><span className="inline-block h-3 w-3 rounded border border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950" /> Unanswered</p>
            <p><span className="inline-block h-3 w-3 rounded border border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-950" /> Answered</p>
            <p><span className="inline-block h-3 w-3 rounded border border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-950" /> Review</p>
          </div>
        </div>
      </div>
    </div>
  );
}
