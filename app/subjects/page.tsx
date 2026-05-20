import Link from "next/link";

const gsSubjects = [
  { name: "Ancient History", slug: "ancient-history", icon: "🏛️", difficulty: "Medium" },
  { name: "Medieval History", slug: "medieval-history", icon: "⚔️", difficulty: "Medium" },
  { name: "Modern History", slug: "modern-history", icon: "🏗️", difficulty: "Hard" },
  { name: "Art & Culture", slug: "art-culture", icon: "🎨", difficulty: "Medium" },
  { name: "Polity & Governance", slug: "polity", icon: "⚖️", difficulty: "Hard" },
  { name: "Economy", slug: "economy", icon: "📊", difficulty: "Hard" },
  { name: "Geography", slug: "geography", icon: "🌍", difficulty: "Medium" },
  { name: "Environment & Ecology", slug: "environment", icon: "🌿", difficulty: "Medium" },
  { name: "Science & Technology", slug: "science", icon: "🔬", difficulty: "Medium" },
  { name: "International Relations", slug: "international-relations", icon: "🤝", difficulty: "Medium" },
  { name: "Current Affairs", slug: "current-affairs", icon: "📰", difficulty: "Easy" },
];

const csatSubjects = [
  { name: "Reading Comprehension", slug: "comprehension", icon: "📖", difficulty: "Medium" },
  { name: "Logical Reasoning", slug: "logical-reasoning", icon: "🧠", difficulty: "Hard" },
  { name: "Analytical Reasoning", slug: "analytical-reasoning", icon: "🔍", difficulty: "Hard" },
  { name: "Quantitative Aptitude", slug: "quantitative", icon: "🔢", difficulty: "Medium" },
  { name: "Data Interpretation", slug: "data-interpretation", icon: "📈", difficulty: "Medium" },
  { name: "Mental Ability", slug: "mental-ability", icon: "💡", difficulty: "Hard" },
];

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600 dark:text-green-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-red-600 dark:text-red-400",
};

function SubjectCard({ name, slug, icon, difficulty, base }: { name: string; slug: string; icon: string; difficulty: string; base: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{name}</h3>
      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>50 Questions</span>
        <span className={difficultyColor[difficulty]}>{difficulty}</span>
      </div>
      <Link href={`/test/${base}/${slug}`} className="mt-4 block w-full rounded-lg bg-zinc-900 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
        Start Test
      </Link>
    </div>
  );
}

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Subject-wise Practice</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Choose a subject to practice targeted questions</p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-zinc-100">GS Subject Tests</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gsSubjects.map((s) => <SubjectCard key={s.slug} {...s} base="gs" />)}
        </div>

        <h2 className="mt-12 text-xl font-semibold text-zinc-900 dark:text-zinc-100">CSAT Subject Tests</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {csatSubjects.map((s) => <SubjectCard key={s.slug} {...s} base="csat" />)}
        </div>

        <Link href="/" className="mt-10 inline-block text-sm text-zinc-600 underline dark:text-zinc-400">← Back to Home</Link>
      </div>
    </div>
  );
}
