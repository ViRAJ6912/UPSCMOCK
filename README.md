# UPSC Prelims Practice Portal

An interactive mock-test platform that mirrors the structure, marking scheme, and timing of the UPSC Civil Services Preliminary Examination.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Recharts**, and browser **localStorage**.

## Features

- **Real exam pattern**
  - GS Paper I — 100 Qs, 200 marks, 2 hr, +2 / −0.66, 0 if unattempted
  - CSAT Paper II — 80 Qs, 200 marks, 2 hr, +2.5 / −0.83, 0 if unattempted, 33% (66 marks) qualifying
- **Test environment**: live countdown with colour-coded warnings, palette navigator, mark-for-review, save & next, skip, clear response
- **UPSC-style status colours** in the palette: grey (not visited), red (unanswered/skipped), green (answered), purple (marked for review)
- **Auto-save to localStorage** — refresh or close the tab and resume right where you left off
- **Auto-submit** when the timer hits zero
- **Detailed result** — total / correct / wrong / unattempted, accuracy, deduction, time used, percentage, performance category, indicative rank band, donut chart, subject-wise analysis, full review with explanations and filters (Wrong / Correct / Unattempted)
- **Dashboard** — total attempts, average score, best score, recent-attempts table, CSAT pass count
- **Responsive**: works on desktop, tablet, and mobile

## Project structure

```
app/
  layout.tsx           # Root layout, fonts, header, footer
  page.tsx             # Home
  test/[paper]/page.tsx# Server-rendered test page (loads JSON, renders <TestRunner/>)
  results/page.tsx     # /results?paper=<id>
  dashboard/page.tsx   # Aggregated stats from localStorage
  not-found.tsx
  globals.css

components/
  Header.tsx
  PaperCard.tsx
  Timer.tsx
  QuestionCard.tsx
  QuestionPalette.tsx
  SubmitModal.tsx
  TestRunner.tsx       # Client orchestrator: timer + state + autosave
  ResultSummary.tsx
  PerformancePie.tsx
  SubjectAnalysis.tsx
  ReviewList.tsx
  ResultsClient.tsx
  DashboardClient.tsx
  StatusPill.tsx

hooks/
  useTimer.ts          # 1s countdown, paused control, onTick + onExpire
  useTestState.ts      # answers/marked/visited/currentIdx + localStorage persist+resume

lib/
  papers.ts            # Paper manifest + server-only fs loader
  scoring.ts           # computeResult / categorize / rank band / formatTime
  storage.ts           # localStorage helpers
  cn.ts

types/
  index.ts             # Question, PaperMeta, TestProgress, TestResult, etc.

data/
  gs1.json             # GS Paper 1 — 100 questions
  csat1.json           # CSAT Paper 1 — 80 questions
  # gs2..gs5.json, csat2..csat5.json — drop in to enable
```

## Adding more papers

The platform is designed so that new papers are pure data drops:

1. Place a JSON file in `data/` named `<id>.json` (e.g. `gs2.json`, `csat3.json`).
2. The home page, `/test/[paper]` route, and dashboard pick it up automatically — `lib/papers.ts` filters the manifest to only include paper IDs whose data file is present on disk.
3. If you want to add an entirely new paper ID (beyond gs1–gs5 and csat1–csat5), add an entry to `PAPER_DEFS` in `lib/papers.ts`.

The question file must be a JSON array. Each item:

```json
{
  "id": 1,
  "paper": "GS1",
  "subject": "Polity",
  "question": "Question text",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correct": "C",
  "explanation": "Detailed explanation"
}
```

GS papers must contain exactly 100 questions; CSAT papers must contain exactly 80. The test page sanity-checks the count before rendering.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Notes on question content

- All seeded questions follow UPSC-pattern phrasing and topic distribution.
- Each correct answer is verified against well-established facts (constitutional articles, dates, geographic facts, mathematical derivations, etc.) and includes an explanation.
- The "indicative rank band" is a directional indicator anchored on percentage of max marks; it is **not** an official rank and actual UPSC cutoffs vary year to year.

## License

MIT.
