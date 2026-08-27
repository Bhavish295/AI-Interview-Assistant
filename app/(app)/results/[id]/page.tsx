import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import ResultModel from "@/models/Result";
import { requireUser } from "@/lib/requireUser";
import { TallyLight } from "@/components/ui/TallyLight";
import { VuMeter } from "@/components/ui/VuMeter";
import { Button } from "@/components/ui/Button";

type AnswerRecord = {
  question: string;
  answer: string;
  score: number;
  technicalAccuracy: number;
  communication: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
};

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  if (!user) notFound();

  await connectDB();
  const result = await ResultModel.findOne({ _id: id, userId: user._id }).lean();
  if (!result) notFound();

  const answers = result.answers as AnswerRecord[];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <TallyLight label="PLAYBACK COMPLETE" active={false} />
        </div>
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Session wrapped
        </h1>
        <p className="mt-2 text-mist">
          {result.track} · {result.difficulty}
        </p>
        <p className="mt-4 font-mono text-5xl font-bold text-signal">{result.overallScore.toFixed(1)}/10</p>
      </div>

      {result.resumeInsight && (
        <div className="cue-card mb-6 p-6 pl-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mist">Resume insight</p>
          <p className="mt-2 text-sm text-ink/80">{result.resumeInsight}</p>
        </div>
      )}

      <div className="space-y-4">
        {answers.map((a, i) => (
          <div key={i} className="cue-card p-6 pl-8">
            <p className="font-display text-lg font-bold leading-snug">{a.question}</p>
            <p className="mt-2 text-sm italic text-ink/60">
              {a.answer ? `“${a.answer}”` : "No answer given"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <VuMeter label="Overall" value={a.score} />
              <VuMeter label="Technical" value={a.technicalAccuracy} />
              <VuMeter label="Comms" value={a.communication} />
              <VuMeter label="Confidence" value={a.confidence} />
            </div>
            {a.improvementTips.length > 0 && (
              <p className="mt-4 text-sm text-ink/70">
                <span className="font-medium text-brass">Try this: </span>
                {a.improvementTips.join(" ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/setup">
          <Button variant="secondary">New interview</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
