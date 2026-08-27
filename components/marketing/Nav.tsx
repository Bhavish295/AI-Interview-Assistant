import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { TallyLight } from "@/components/ui/TallyLight";

export async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-mist/15 bg-paper/80 backdrop-blur dark:bg-ink/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold uppercase tracking-tight">
          On<span className="text-signal">Air</span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-mist md:flex">
          <a href="#how-it-works" className="hover:text-current">How it works</a>
          <a href="#features" className="hover:text-current">Features</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" variant="secondary">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium hover:text-signal sm:inline">
                Log in
              </Link>
              <Link href="/signup">
                <Button size="sm">Start free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function LiveBadge() {
  return <TallyLight label="LIVE PRACTICE" />;
}
