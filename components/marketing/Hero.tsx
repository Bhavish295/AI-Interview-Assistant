import Link from "next/link";
import { POPULAR_INTERVIEWS } from "@/lib/popularInterviews";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 pt-12">
      <h1 className="text-center text-3xl font-bold tracking-tight text-signal sm:text-4xl md:text-5xl">
        Popular Interviews
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-mist">
        Choose a topic and start. You will answer questions and get a score with tips.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_INTERVIEWS.map((item) => (
          <article
            key={item.track}
            className="flex flex-col rounded-2xl border border-white/10 bg-panel p-6 shadow-lg shadow-black/20"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-signal/15 text-lg font-bold text-signal shadow-[0_0_24px_rgba(34,211,238,0.25)]">
              {item.icon}
            </div>
            <h2 className="mt-5 text-center text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-2 flex-1 text-center text-sm leading-relaxed text-mist">{item.blurb}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-signal/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-signal">
                {item.tag}
              </span>
              <span className="rounded-full bg-brass/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brass">
                {item.difficulty}
              </span>
            </div>
            <Link href={`/setup?track=${encodeURIComponent(item.track)}`} className="mt-5 block">
              <Button className="w-full">Start Interview</Button>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
