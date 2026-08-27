import Link from "next/link";
import type { ReactNode } from "react";
import { TallyLight } from "@/components/ui/TallyLight";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16 text-paper">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Link href="/" className="font-display text-2xl font-extrabold uppercase tracking-tight text-paper">
            On<span className="text-signal">Air</span>
          </Link>
          <TallyLight label={eyebrow} />
        </div>

        <div className="cue-card px-8 py-10">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-paper/60">{footer}</p>
      </div>
    </div>
  );
}
