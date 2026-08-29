import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-white">Page not found</h1>
      <p className="text-mist">This link does not exist. Go back home to pick an interview.</p>
      <Link href="/">
        <Button className="mt-2">Go home</Button>
      </Link>
    </div>
  );
}
