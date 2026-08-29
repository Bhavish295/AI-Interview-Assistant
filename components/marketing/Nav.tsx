import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <Link href="/" className="hover:text-signal">
            Home
          </Link>
          <a href="#about" className="hover:text-signal">
            About Us
          </a>
          <a href="#features" className="hover:text-signal">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" prefetch>
            <Button size="sm" variant="secondary">
              Login
            </Button>
          </Link>
          <Link href="/signup" prefetch>
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
