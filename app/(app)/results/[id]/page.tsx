import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import ResultModel from "@/models/Result";
import { requireUser } from "@/lib/requireUser";
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
        <p className="text-sm text-mist">
          {result.track} · {result.difficulty}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Interview summary</h1>
        <p className="mt-4 text-5xl font-semibold tabular-nums text-signal">{result.overallScore.toFixed(1)}/10</p>
        <p className="mt-1 text-sm text-mist">Overall score</p>
      </div>

      {result.resumeInsight && (
        <div className="cue-card mb-6 p-6">
          <p className="text-sm font-medium">From your resume</p>
          <p className="mt-2 text-sm text-mist">{result.resumeInsight}</p>
        </div>
      )}

      <div className="space-y-4">
        {answers.map((a, i) => (
          <div key={i} className="cue-card p-6">
            <p className="text-xs font-medium text-mist">Question {i + 1}</p>
            <p className="mt-1 font-semibold leading-snug">{a.question}</p>
            <p className="mt-2 text-sm italic text-mist">{a.answer ? `"${a.answer}"` : "No answer given"}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <VuMeter label="Overall" value={a.score} />
              <VuMeter label="Technical" value={a.technicalAccuracy} />
              <VuMeter label="Clarity" value={a.communication} />
              <VuMeter label="Confidence" value={a.confidence} />
            </div>
            {a.improvementTips.length > 0 && (
              <p className="mt-4 text-sm">
                <span className="font-medium">Tip: </span>
                {a.improvementTips.join(" ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/setup">
          <Button variant="secondary">Practice again</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Back to results</Button>
        </Link>
      </div>
    </div>
  );
}
