const STEPS = [
  { label: "CUE", title: "Pick your track", body: "Choose a role and difficulty, or upload a resume so questions match your background." },
  { label: "REC", title: "Answer live", body: "A question appears on your cue card. Speak or type your answer before the 30-second tally light runs out." },
  { label: "PLAYBACK", title: "Get real feedback", body: "The AI scores accuracy, communication, and confidence, then tells you exactly what to fix." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">Run of show</p>
      <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl">
        Three takes to ready.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.label} className="cue-card p-6 pl-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-signal">{s.label}</span>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
