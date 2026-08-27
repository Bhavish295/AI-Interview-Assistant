import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TallyLight } from "@/components/ui/TallyLight";
import { Waveform } from "@/components/ui/Waveform";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
      <div className="mb-6 flex justify-center">
        <TallyLight label="ON AIR IN 60 SECONDS" />
      </div>

      <h1 className="text-balance text-center font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tight sm:text-[9vw] md:text-[6.5rem]">
        Rehearse the
        <br />
        <span className="text-signal">real interview.</span>
      </h1>

      <p className="mx-auto mt-8 max-w-xl text-balance text-center font-body text-lg text-mist">
        Speak your answers to a live AI interviewer, get scored feedback in seconds, and
        walk into the real room already warmed up.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/signup">
          <Button size="lg">Start a mock interview</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="ghost">I already have an account</Button>
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-mist/20 bg-panel-2/5 p-8">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-mist">
          <span>Studio Mic — Channel 01</span>
          <span>00:22 / 00:30</span>
        </div>
        <Waveform bars={48} />
      </div>
    </section>
  );
}
