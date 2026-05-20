import Link from "next/link";

export default function Home() {
  const exams = [
    { title: "GS Paper I", questions: 100, marks: 200, duration: "2 Hours", href: "/test/gs1" },
    { title: "CSAT Paper II", questions: 80, marks: 200, duration: "2 Hours", href: "/test/csat1" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          UPSC Prelims Practice Portal
        </h1>
        <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400">
          Select a paper to begin your practice session
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {exams.map((exam) => (
            <div
              key={exam.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {exam.title}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>{exam.questions} Questions</li>
                <li>{exam.marks} Marks</li>
                <li>{exam.duration}</li>
              </ul>
              <Link
                href={exam.href}
                className="mt-6 block w-full rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Start Test
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
