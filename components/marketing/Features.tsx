const CHANNELS = [
  {
    n: "01",
    title: "Any track, real questions",
    body: "Software engineering, system design, product, data science, or behavioral — pick a track or write in your own role.",
  },
  {
    n: "02",
    title: "Speak, don't type",
    body: "Answer out loud with live voice-to-text, exactly like a real call. Text input works too, no mic required.",
  },
  {
    n: "03",
    title: "Honest AI scoring",
    body: "Every answer is graded on technical accuracy, communication, and confidence — with specific strengths and gaps, not a vague grade.",
  },
  {
    n: "04",
    title: "Resume-aware questions",
    body: "Upload your resume and the interviewer weighs its questions toward what's actually on it.",
  },
  {
    n: "05",
    title: "Track your trend",
    body: "Every session is logged. See which tracks you're strong on and which need more reps before the real thing.",
  },
  {
    n: "06",
    title: "Built for teams",
    body: "Admins can curate a custom question bank for a bootcamp, cohort, or hiring pipeline.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-y border-mist/15 bg-panel-2/5">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-lg">
          <p className="font-mono text-xs uppercase tracking-widest text-signal">The console</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl">
            Six channels, one booth.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <div
              key={c.n}
              className={`border-mist/15 px-6 py-8 ${i % 3 !== 2 ? "sm:border-r" : ""} ${
                i < 3 ? "border-b" : ""
              }`}
            >
              <span className="font-mono text-xs text-mist">{c.n}</span>
              <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight">{c.title}</h3>
              <p className="mt-2 text-sm text-mist">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
