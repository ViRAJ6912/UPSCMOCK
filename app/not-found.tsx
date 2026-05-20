import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="font-serif text-4xl text-ink mb-2">404</h1>
      <p className="text-ink-soft mb-5">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="inline-block bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark transition">
        Back to Home
      </Link>
    </div>
  );
}
