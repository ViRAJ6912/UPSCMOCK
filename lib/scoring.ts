import type {
  PaperMeta,
  Question,
  OptionKey,
  TestResult,
  SubjectStat,
  ReviewItem,
  PerformanceCategory,
} from "@/types";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeResult(
  paper: PaperMeta,
  questions: Question[],
  answers: Array<OptionKey | null>,
  timeUsedSec: number,
): TestResult {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const subjMap: Record<string, SubjectStat> = {};
  const review: ReviewItem[] = [];

  questions.forEach((q, idx) => {
    const userAns = answers[idx] ?? null;
    const subject = q.subject || (paper.type === "csat" ? "General" : "General Studies");
    if (!subjMap[subject]) {
      subjMap[subject] = { subject, total: 0, correct: 0, wrong: 0, skipped: 0, scored: 0 };
    }
    const s = subjMap[subject];
    s.total++;

    let status: ReviewItem["status"];
    if (userAns == null) {
      skipped++;
      s.skipped++;
      status = "skip";
    } else if (userAns === q.correct) {
      correct++;
      s.correct++;
      s.scored = round2(s.scored + paper.perCorrect);
      status = "correct";
    } else {
      wrong++;
      s.wrong++;
      s.scored = round2(s.scored + paper.perWrong);
      status = "wrong";
    }
    review.push({ index: idx, question: q, userAns, status });
  });

  const correctMarks = round2(correct * paper.perCorrect);
  const wrongMarks = round2(wrong * paper.perWrong); // negative
  const finalScore = round2(correctMarks + wrongMarks);
  const attempted = correct + wrong;
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 1000) / 10;
  const percent = Math.round((finalScore / paper.marks) * 1000) / 10;

  const pass: boolean | null =
    paper.type === "csat" && paper.qualifying != null
      ? finalScore >= paper.qualifying
      : null;

  const category = categorize(paper, finalScore);
  const rankBand = estimateRankBand(paper, finalScore);

  return {
    paperId: paper.id,
    paperCode: paper.code,
    paperName: paper.name,
    type: paper.type,
    total: paper.total,
    maxMarks: paper.marks,
    correct,
    wrong,
    skipped,
    correctMarks,
    wrongMarks,
    deduction: Math.abs(wrongMarks),
    finalScore,
    percent,
    accuracy,
    timeUsedSec,
    durationSec: paper.durationSec,
    pass,
    qualifying: paper.qualifying ?? null,
    category,
    rankBand,
    subjects: Object.values(subjMap).sort((a, b) => b.total - a.total),
    review,
    completedAt: Date.now(),
  };
}

function categorize(paper: PaperMeta, score: number): PerformanceCategory {
  // Anchored on % of max marks. CSAT uses qualifying (33%) + headroom.
  const pct = (score / paper.marks) * 100;
  if (paper.type === "gs") {
    if (pct >= 60) return "Excellent";
    if (pct >= 45) return "Good";
    if (pct >= 30) return "Average";
    return "Needs Improvement";
  }
  // CSAT
  if (pct >= 60) return "Excellent";
  if (pct >= 45) return "Good";
  if (pct >= 33) return "Average";
  return "Needs Improvement";
}

/**
 * An indicative rank band derived from a synthetic distribution loosely
 * calibrated against publicly-known historical UPSC Prelims cutoff ranges.
 * NOT an official rank — just a directional indicator for self-assessment.
 */
function estimateRankBand(paper: PaperMeta, score: number): string {
  if (paper.type === "gs") {
    if (score >= 130) return "Top 0.5% — Highly Competitive";
    if (score >= 115) return "Top 2% — Strong Selection Zone";
    if (score >= 100) return "Top 5% — Likely Cutoff Zone";
    if (score >= 88)  return "Top 10% — Borderline Cutoff";
    if (score >= 70)  return "Top 25% — Below Recent Cutoffs";
    if (score >= 50)  return "Top 50% — Foundation Building Stage";
    return "Bottom 50% — Significant Improvement Required";
  }
  if (score >= 150) return "Excellent — Far Above Qualifying";
  if (score >= 120) return "Strong — Comfortably Qualifies";
  if (score >= 90)  return "Good — Comfortably Qualifies";
  if (score >= 66)  return "Qualifies — Above 33% Threshold";
  if (score >= 40)  return "Below Qualifying — Practice Required";
  return "Well Below Qualifying — Major Gaps";
}

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function formatTimeShort(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
