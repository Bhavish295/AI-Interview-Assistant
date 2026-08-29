import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal/20 text-sm font-bold text-signal">
        IP
      </span>
      <span className="text-[15px] font-semibold text-white">
        Interview{" "}
        <span className="ml-0.5 rounded-md bg-signal/15 px-1.5 py-0.5 text-signal">Portal</span>
      </span>
    </Link>
  );
}
