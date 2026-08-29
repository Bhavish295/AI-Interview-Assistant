const ITEMS = [
  {
    title: "Questions by job type",
    body: "Software, algorithms, system design, product, data science, or HR questions.",
  },
  {
    title: "Speak or type",
    body: "Use a microphone like a video call, or type your answer. Chrome works best for voice.",
  },
  {
    title: "Clear scores",
    body: "Each answer is scored on accuracy, clarity, and confidence, plus short tips.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-y border-white/10 bg-navy/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-signal">Features</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ITEMS.map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-panel p-6">
              <h3 className="font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
