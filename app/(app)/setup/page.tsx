import { SetupForm } from "@/components/app/SetupForm";
import { TallyLight } from "@/components/ui/TallyLight";

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <TallyLight label="CUE" />
        </div>
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Choose your interview
        </h1>
        <p className="mt-2 text-mist">Pick a track and difficulty, then step up to the mic.</p>
      </div>
      <SetupForm />
    </div>
  );
}
