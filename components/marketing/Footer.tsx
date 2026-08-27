import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-mist/15">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-mist sm:flex-row">
        <span className="font-display text-lg font-extrabold uppercase tracking-tight">
          On<span className="text-signal">Air</span>
        </span>
        <p>Practice out loud. Walk in ready.</p>
        <Link href="/signup" className="font-medium text-signal hover:underline">
          Start free
        </Link>
      </div>
    </footer>
  );
}
