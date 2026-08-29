const STEPS = [
  {
    n: "1",
    title: "Pick a topic",
    body: "Choose Software Engineering, DSA, System Design, and more. Start with Easy if it is your first time.",
  },
  {
    n: "2",
    title: "Answer the questions",
    body: "Speak into the microphone or type. You have 30 seconds for each question.",
  },
  {
    n: "3",
    title: "See your score",
    body: "Get a score out of 10, what went well, and what to practice next.",
  },
];

export function HowItWorks() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center text-3xl font-bold tracking-tight text-signal">About Us</h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-mist">
        Interview Portal helps you practice real interview questions before the actual meeting.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="cue-card p-6">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-signal text-sm font-bold text-navy">
              {s.n}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
