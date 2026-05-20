import Link from "next/link";
import { PaperCard } from "@/components/PaperCard";
import { getPapersByType } from "@/lib/papers";

export const dynamic = "force-static";

export default function HomePage() {
  const gsPapers = getPapersByType("gs");
  const csatPapers = getPapersByType("csat");
  const totalQuestions =
    gsPapers.reduce((s, p) => s + p.total, 0) +
    csatPapers.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-br from-white to-amber-50/40 border border-black/5 rounded-3xl p-8 sm:p-10 shadow-card">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-accent/10 text-accent mb-3">
            Civil Services Examination — Preliminary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
            UPSC Prelims <span className="text-accent">Practice Portal</span>
          </h1>
          <p className="text-ink-soft mt-3 text-base">
            Real exam pattern. Real timer. Real negative marking. Pick a paper and begin.
            Your progress saves automatically — refresh and resume anytime.
          </p>
        </div>
        <dl className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat value={String(gsPapers.length + csatPapers.length)} label="Available Papers" />
          <Stat value={String(totalQuestions)} label="Total Questions" />
          <Stat value="2 hrs" label="Per Paper" />
          <Stat value="1/3" label="Negative Marking" />
        </dl>
      </section>

      {gsPapers.length > 0 && (
        <section>
          <SectionHead
            title="General Studies — Paper I"
            desc="100 questions · 200 marks · 2 hours · +2 correct · −0.66 wrong"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gsPapers.map((p, i) => (
              <PaperCard key={p.id} paper={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {csatPapers.length > 0 && (
        <section>
          <SectionHead
            title="CSAT — Paper II"
            desc="80 questions · 200 marks · 2 hours · +2.5 correct · −0.83 wrong · qualifying at 33% (66 marks)"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {csatPapers.map((p, i) => (
              <PaperCard key={p.id} paper={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {gsPapers.length === 0 && csatPapers.length === 0 && (
        <section className="bg-surface border border-black/5 rounded-2xl p-8 text-center shadow-card">
          <h2 className="font-serif text-2xl text-ink mb-1">No papers available yet</h2>
          <p className="text-ink-soft">
            Drop a JSON file (e.g. <code className="px-1.5 py-0.5 bg-paper rounded">data/gs1.json</code>) into
            the project to enable a paper.
          </p>
        </section>
      )}

      <section className="bg-surface border border-black/5 rounded-2xl p-6 shadow-card">
        <h2 className="font-serif text-xl text-ink mb-2">How the marking works</h2>
        <ul className="text-sm text-ink-soft space-y-1.5 list-disc pl-5">
          <li><strong>GS Paper I:</strong> 100 Qs, 200 marks, 2 hours. +2 per correct, −0.66 per wrong, 0 if unattempted.</li>
          <li><strong>CSAT Paper II:</strong> 80 Qs, 200 marks, 2 hours. +2.5 per correct, −0.83 per wrong, 0 if unattempted. 33% (66 marks) is qualifying.</li>
          <li><strong>Auto-submit</strong> when timer reaches zero. <strong>Auto-save</strong> while you work.</li>
        </ul>
        <div className="mt-4">
          <Link href="/dashboard" className="text-sm font-semibold text-accent hover:underline">
            View your dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-black/5 rounded-xl px-4 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">{label}</dt>
      <dd className="font-serif text-2xl text-accent font-bold mt-0.5">{value}</dd>
    </div>
  );
}

function SectionHead({ title, desc }: { title: string; desc: string }) {
  return (
    <header className="mb-4">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <p className="text-sm text-ink-mute">{desc}</p>
    </header>
  );
}
