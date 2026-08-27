import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TallyLight } from "@/components/ui/TallyLight";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-paper">
      <TallyLight label="DEAD AIR" active={false} />
      <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight">Nothing on this channel</h1>
      <p className="text-paper/60">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/">
        <Button className="mt-2">Back to the studio</Button>
      </Link>
    </div>
  );
}
