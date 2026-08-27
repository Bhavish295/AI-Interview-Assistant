import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/components/app/LogoutButton";

const NAV = [
  { href: "/setup", label: "New interview" },
  { href: "/dashboard", label: "Dashboard" },
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
    <div className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper">
      <header className="sticky top-0 z-40 border-b border-mist/15 bg-paper/90 backdrop-blur dark:bg-ink/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-display text-lg font-extrabold uppercase tracking-tight">
            On<span className="text-signal">Air</span>
          </Link>

          <nav className="hidden items-center gap-6 font-body text-sm text-mist md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-current">
                {item.label}
              </Link>
            ))}
            {user.role === "admin" && (
              <Link href="/admin" className="hover:text-current">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden font-mono text-xs uppercase tracking-widest text-mist sm:inline">{user.name}</span>
            <LogoutButton />
          </div>
        </div>

        <nav className="flex gap-4 overflow-x-auto border-t border-mist/10 px-6 py-2 font-body text-sm text-mist md:hidden">
          {NAV.concat(user.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []).map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-current">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
