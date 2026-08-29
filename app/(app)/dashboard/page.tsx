import Link from "next/link";
import { connectDB } from "@/lib/db";
import ResultModel from "@/models/Result";
import { requireUser } from "@/lib/requireUser";
import { VuMeter } from "@/components/ui/VuMeter";
import { Button } from "@/components/ui/Button";
import { TrendChart } from "@/components/app/DashboardCharts";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) return null;

  await connectDB();
  const results = await ResultModel.find({ userId: user._id }).sort({ createdAt: 1 }).lean();

  if (results.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight">No interviews yet</h1>
        <p className="mt-2 text-mist">Complete one practice interview and your scores will show up here.</p>
        <Link href="/setup">
          <Button className="mt-6">Start your first interview</Button>
        </Link>
      </div>
    );
  }

  const avgScore = results.reduce((sum, r) => sum + r.overallScore, 0) / results.length;

  const byTrack: Record<string, { sum: number; count: number }> = {};
  for (const r of results) {
    const t = r.track || "General";
    byTrack[t] ??= { sum: 0, count: 0 };
    byTrack[t].sum += r.overallScore;
    byTrack[t].count += 1;
  }
  const trackAverages = Object.entries(byTrack).map(([track, v]) => ({ track, avg: v.sum / v.count }));
  const strongest = trackAverages.reduce((a, b) => (b.avg > a.avg ? b : a));
  const weakest = trackAverages.reduce((a, b) => (b.avg < a.avg ? b : a));

  const chartData = results.slice(-10).map((r, i) => ({
    label: `#${results.length - Math.min(10, results.length) + i + 1}`,
    score: r.overallScore,
  }));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-mist">{results.length} interview{results.length === 1 ? "" : "s"} completed</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Your results</h1>
        </div>
        <Link href="/setup">
          <Button>New interview</Button>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Average score" value={`${avgScore.toFixed(1)}/10`} />
        <StatCard label="Strongest topic" value={strongest.track} sub={`${strongest.avg.toFixed(1)}/10`} />
        <StatCard label="Practice this more" value={weakest.track} sub={`${weakest.avg.toFixed(1)}/10`} />
      </div>

      <div className="cue-card mb-8 p-6">
        <p className="mb-2 text-sm font-medium">Score over time</p>
        <TrendChart data={chartData} />
      </div>

      <p className="mb-3 text-sm font-medium">Past interviews</p>
      <div className="space-y-3">
        {[...results].reverse().map((r) => (
          <Link
            key={r._id.toString()}
            href={`/results/${r._id}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-panel px-5 py-4 hover:border-signal/40"
          >
            <div>
              <p className="font-semibold">{r.track}</p>
              <p className="text-xs text-mist">
                {r.difficulty} · {new Date(r.createdAt as unknown as string).toLocaleDateString()}
              </p>
            </div>
            <div className="w-32">
              <VuMeter label="Score" value={r.overallScore} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="cue-card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-mist">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {sub && <p className="text-sm text-brass">{sub}</p>}
    </div>
  );
}
