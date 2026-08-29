import { SetupForm } from "@/components/app/SetupForm";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-signal">Step 1 of 3</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">Start a mock interview</h1>
        <p className="mt-2 text-mist">Choose a topic and difficulty. You will get about 5 questions.</p>
      </div>
      <SetupForm initialTrack={track} />
    </div>
  );
}
