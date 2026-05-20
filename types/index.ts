export type OptionKey = "A" | "B" | "C" | "D";

export interface Question {
  id: number;
  paper: string;
  subject: string;
  question: string;
  options: Record<OptionKey, string>;
  correct: OptionKey;
  explanation: string;
}

export type PaperType = "gs" | "csat";

export interface PaperMeta {
  id: string;            // e.g. "gs1"
  code: string;          // e.g. "GS1"
  name: string;          // e.g. "GS Paper 1"
  type: PaperType;
  total: number;
  marks: number;
  perCorrect: number;
  perWrong: number;      // negative number
  durationSec: number;
  qualifying?: number;   // CSAT only (66)
  difficulty: "Easy" | "Moderate" | "Hard" | "Mixed";
  description: string;
  file: string;          // JSON filename in /data
}

export interface PaperData {
  meta: PaperMeta;
  questions: Question[];
}

export type QuestionStatus =
  | "unseen"
  | "answered"
  | "skipped"     // visited but no answer
  | "marked"      // marked for review (with or without answer)
  | "marked-answered";

export interface TestProgress {
  paperId: string;
  answers: Array<OptionKey | null>;
  marked: boolean[];
  visited: boolean[];
  currentIdx: number;
  startedAt: number;
  remainingSec: number;
  lastSavedAt: number;
}

export interface SubjectStat {
  subject: string;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  scored: number;
}

export interface ReviewItem {
  index: number;
  question: Question;
  userAns: OptionKey | null;
  status: "correct" | "wrong" | "skip";
}

export type PerformanceCategory = "Excellent" | "Good" | "Average" | "Needs Improvement";

export interface TestResult {
  paperId: string;
  paperCode: string;
  paperName: string;
  type: PaperType;
  total: number;
  maxMarks: number;
  correct: number;
  wrong: number;
  skipped: number;
  correctMarks: number;
  wrongMarks: number;       // negative
  deduction: number;        // absolute value
  finalScore: number;
  percent: number;
  accuracy: number;
  timeUsedSec: number;
  durationSec: number;
  pass: boolean | null;
  qualifying: number | null;
  category: PerformanceCategory;
  rankBand: string;
  subjects: SubjectStat[];
  review: ReviewItem[];
  completedAt: number;
}
