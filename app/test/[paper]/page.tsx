import Link from "next/link";
import { notFound } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { getPaperMeta, loadPaper, getAvailablePapers } from "@/lib/papers";

export async function generateStaticParams() {
  return getAvailablePapers().map((p) => ({ paper: p.id }));
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ paper: string }>;
}) {
  const { paper: paperId } = await params;
  const meta = getPaperMeta(paperId);
  if (!meta) notFound();

  const data = await loadPaper(paperId);
  if (!data) {
    return (
      <div className="bg-surface border border-black/5 rounded-2xl p-8 text-center shadow-card">
        <h1 className="font-serif text-2xl text-ink mb-2">{meta.name} — Coming Soon</h1>
        <p className="text-ink-soft mb-4">
          This paper isn&apos;t available yet on this device. Drop a{" "}
          <code className="px-1.5 py-0.5 bg-paper rounded">data/{meta.file}</code> file into the project to enable it.
        </p>
        <Link href="/" className="inline-block bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark transition">
          Back to Home
        </Link>
      </div>
    );
  }

  // Sanity check: question count should match metadata.
  const expected = meta.total;
  const actual = data.questions.length;
  if (actual !== expected) {
    return (
      <div className="bg-surface border border-bad/30 rounded-2xl p-8 text-center shadow-card">
        <h1 className="font-serif text-2xl text-bad mb-2">Question count mismatch</h1>
        <p className="text-ink-soft">
          Expected {expected} questions for {meta.name}, but the data file has {actual}.
        </p>
      </div>
    );
  }

  return <TestRunner paper={data.meta} questions={data.questions} />;
}
