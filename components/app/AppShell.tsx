import { Logo } from "@/components/brand/Logo";
import { LogoutButton } from "@/components/app/LogoutButton";
import Link from "next/link";

const NAV = [
  { href: "/setup", label: "New interview" },
  { href: "/dashboard", label: "My results" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: "user" | "admin" };
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Logo href="/dashboard" />

          <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-signal">
                {item.label}
              </Link>
            ))}
            {user.role === "admin" && (
              <Link href="/admin" className="hover:text-signal">
                Questions
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-mist sm:inline">{user.name}</span>
            <LogoutButton />
          </div>
        </div>

        <nav className="flex gap-4 overflow-x-auto border-t border-white/10 px-6 py-2 text-sm text-mist md:hidden">
          {NAV.concat(user.role === "admin" ? [{ href: "/admin", label: "Questions" }] : []).map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-signal">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
