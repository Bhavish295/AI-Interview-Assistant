import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-mist sm:flex-row">
        <Logo />
        <p>Practice interviews. Walk in more ready.</p>
        <Link href="/signup" className="font-medium text-signal hover:underline">
          Sign Up free
        </Link>
      </div>
    </footer>
  );
}
