import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="bg-accent text-white font-extrabold text-[11px] tracking-wider px-2 py-1 rounded">
            UPSC
          </span>
          <span className="font-semibold text-ink">Prelims Practice Portal</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-ink-soft hover:text-accent transition">Home</Link>
          <Link href="/dashboard" className="text-ink-soft hover:text-accent transition">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
