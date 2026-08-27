import Link from "next/link";
import { connectDB } from "@/lib/db";
import ResultModel from "@/models/Result";
import { requireUser } from "@/lib/requireUser";
import { TallyLight } from "@/components/ui/TallyLight";
import { VuMeter } from "@/components/ui/VuMeter";
import { Button } from "@/components/ui/Button";
import { TrendChart } from "@/components/app/DashboardCharts";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) return null; // middleware already guards this route

  await connectDB();
  const results = await ResultModel.find({ userId: user._id }).sort({ createdAt: 1 }).lean();

  if (results.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <TallyLight label="STUDIO EMPTY" active={false} />
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight">No sessions yet</h1>
        <p className="mt-2 text-mist">Run your first mock interview to see your trend here.</p>
        <Link href="/setup">
          <Button className="mt-6">Start an interview</Button>
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
          <TallyLight label={`${results.length} SESSIONS LOGGED`} active={false} />
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Your dashboard
          </h1>
        </div>
        <Link href="/setup">
          <Button>New interview</Button>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Average score" value={`${avgScore.toFixed(1)}/10`} />
        <StatCard label="Strongest track" value={strongest.track} sub={`${strongest.avg.toFixed(1)}/10`} />
        <StatCard label="Needs more reps" value={weakest.track} sub={`${weakest.avg.toFixed(1)}/10`} />
      </div>

      <div className="cue-card mb-8 p-6 pl-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-mist">Score trend — last {chartData.length}</p>
        <div className="oscilloscope-grid rounded-lg">
          <TrendChart data={chartData} />
        </div>
      </div>

      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mist">Session history</p>
      <div className="space-y-3">
        {[...results].reverse().map((r) => (
          <Link
            key={r._id.toString()}
            href={`/results/${r._id}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-mist/20 px-5 py-4 hover:border-signal/40 hover:bg-mist/5"
          >
            <div>
              <p className="font-display text-lg font-bold uppercase tracking-tight">{r.track}</p>
              <p className="font-mono text-xs text-mist">
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
    <div className="cue-card p-5 pl-7">
      <p className="font-mono text-[11px] uppercase tracking-widest text-mist">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">{value}</p>
      {sub && <p className="font-mono text-sm text-brass">{sub}</p>}
    </div>
  );
}
