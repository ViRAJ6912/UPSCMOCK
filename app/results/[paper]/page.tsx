"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Question {
  id: number;
  paper: string;
  subject: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
}

interface Result {
  paper: string;
  answers: Record<number, string>;
  statuses: string[];
  questions: Question[];
  timeUsed: number;
  submittedAt: number;
}

const SCORING: Record<string, { correct: number; wrong: number; pass?: number }> = {
  gs1: { correct: 2, wrong: -0.66 },
  csat1: { correct: 2.5, wrong: -0.83, pass: 66 },
};

export default function ResultsPage() {
  const params = useParams();
  const paper = params.paper as string;
  const [result, setResult] = useState<Result | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`upsc_${paper}_result`);
    if (saved) setResult(JSON.parse(saved));
  }, [paper]);

  if (!result) return <div className="flex min-h-screen items-center justify-center text-zinc-600 dark:text-zinc-400">No results found. <Link href="/" className="ml-2 underline">Go home</Link></div>;

  const { questions, answers, timeUsed } = result;
  const scoring = SCORING[paper] || SCORING.gs1;

  let correct = 0, wrong = 0, unattempted = 0;
  questions.forEach((q, i) => {
    if (answers[i] === undefined) unattempted++;
    else if (answers[i] === q.correct) correct++;
    else wrong++;
  });

  const totalMarks = correct * scoring.correct + wrong * scoring.wrong;
  const maxMarks = questions.length * scoring.correct;
  const accuracy = correct + wrong > 0 ? ((correct / (correct + wrong)) * 100).toFixed(1) : "0";
  const negativeMarks = Math.abs(wrong * scoring.wrong).toFixed(2);
  const passed = scoring.pass !== undefined ? totalMarks >= scoring.pass : null;

  let category = "Needs Improvement";
  const pct = (totalMarks / maxMarks) * 100;
  if (pct >= 80) category = "Excellent";
  else if (pct >= 60) category = "Good";
  else if (pct >= 40) category = "Average";

  const formatTime = (s: number) => `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`;

  // Subject-wise analysis
  const subjectMap: Record<string, { correct: number; wrong: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = { correct: 0, wrong: 0, total: 0 };
    subjectMap[q.subject].total++;
    if (answers[i] === q.correct) subjectMap[q.subject].correct++;
    else if (answers[i] !== undefined) subjectMap[q.subject].wrong++;
  });

  const pieData = [
    { name: "Correct", value: correct, color: "#22c55e" },
    { name: "Wrong", value: wrong, color: "#ef4444" },
    { name: "Unattempted", value: unattempted, color: "#a1a1aa" },
  ];

  const subjectData = Object.entries(subjectMap).map(([name, d]) => ({
    name,
    accuracy: d.correct + d.wrong > 0 ? Math.round((d.correct / (d.correct + d.wrong)) * 100) : 0,
    correct: d.correct,
    total: d.total,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Results — {paper === "gs1" ? "GS Paper I" : "CSAT Paper II"}</h1>
          <Link href="/" className="text-sm text-zinc-600 underline dark:text-zinc-400">Home</Link>
        </div>

        {/* Score Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Marks", value: totalMarks.toFixed(2) + " / " + maxMarks },
            { label: "Correct", value: correct },
            { label: "Wrong", value: wrong },
            { label: "Unattempted", value: unattempted },
            { label: "Accuracy", value: accuracy + "%" },
            { label: "Negative Marks", value: negativeMarks },
            { label: "Time Used", value: formatTime(timeUsed) },
            { label: "Category", value: category },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.value}</p>
            </div>
          ))}
        </div>

        {passed !== null && (
          <div className={`mt-4 rounded-xl p-4 text-center text-lg font-bold ${passed ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"}`}>
            {passed ? "PASSED" : "FAILED"} (Qualifying: {scoring.pass} marks)
          </div>
        )}

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Performance Breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject-wise Accuracy</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Toggle */}
        <button onClick={() => setShowReview(!showReview)} className="mt-8 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          {showReview ? "Hide Review" : "Review Answers"}
        </button>

        {showReview && (
          <div className="mt-6 space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correct;
              const isUnattempted = userAns === undefined;
              return (
                <div key={i} className={`rounded-xl border p-4 ${isUnattempted ? "border-zinc-200 dark:border-zinc-800" : isCorrect ? "border-green-300 dark:border-green-800" : "border-red-300 dark:border-red-800"} bg-white dark:bg-zinc-900`}>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Q{i + 1} — {q.subject}</p>
                  <p className="mt-2 text-zinc-900 dark:text-zinc-100">{q.question}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    {Object.entries(q.options).map(([key, value]) => (
                      <p key={key} className={`rounded px-2 py-1 ${key === q.correct ? "bg-green-100 font-medium text-green-800 dark:bg-green-950 dark:text-green-300" : key === userAns && !isCorrect ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                        {key}. {value}
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium">Your answer:</span> {userAns || "—"} | <span className="font-medium">Correct:</span> {q.correct} | <span className={`font-medium ${isUnattempted ? "text-zinc-500" : isCorrect ? "text-green-600" : "text-red-600"}`}>{isUnattempted ? "Skipped" : isCorrect ? "Correct" : "Wrong"}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400"><span className="font-medium">Explanation:</span> {q.explanation}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Link href="/" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">Home</Link>
          <Link href="/dashboard" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
