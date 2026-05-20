import type { TestProgress, TestResult } from "@/types";

const PREFIX = "upscmock:";
const PROGRESS = (id: string) => `${PREFIX}progress:${id}`;
const RESULT = (id: string) => `${PREFIX}result:${id}`;
const HISTORY_KEY = `${PREFIX}history`;

function isClient() {
  return typeof window !== "undefined";
}

// ---------- Progress (in-flight test) ----------
export function saveProgress(id: string, p: TestProgress): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(PROGRESS(id), JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function loadProgress(id: string): TestProgress | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(PROGRESS(id));
    return raw ? (JSON.parse(raw) as TestProgress) : null;
  } catch {
    return null;
  }
}

export function clearProgress(id: string): void {
  if (!isClient()) return;
  localStorage.removeItem(PROGRESS(id));
}

// ---------- Latest result + per-paper history ----------
export function saveResult(id: string, r: TestResult): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(RESULT(id), JSON.stringify(r));
    const history = loadAllHistory();
    history.unshift({
      paperId: r.paperId,
      paperName: r.paperName,
      type: r.type,
      finalScore: r.finalScore,
      maxMarks: r.maxMarks,
      percent: r.percent,
      accuracy: r.accuracy,
      correct: r.correct,
      wrong: r.wrong,
      skipped: r.skipped,
      timeUsedSec: r.timeUsedSec,
      pass: r.pass,
      category: r.category,
      completedAt: r.completedAt,
    });
    // Keep last 50 attempts
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function loadResult(id: string): TestResult | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(RESULT(id));
    return raw ? (JSON.parse(raw) as TestResult) : null;
  } catch {
    return null;
  }
}

export interface HistoryEntry {
  paperId: string;
  paperName: string;
  type: "gs" | "csat";
  finalScore: number;
  maxMarks: number;
  percent: number;
  accuracy: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeUsedSec: number;
  pass: boolean | null;
  category: string;
  completedAt: number;
}

export function loadAllHistory(): HistoryEntry[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function clearAllHistory(): void {
  if (!isClient()) return;
  localStorage.removeItem(HISTORY_KEY);
}
