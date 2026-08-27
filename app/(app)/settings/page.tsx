import { requireUser } from "@/lib/requireUser";
import { PasswordForm } from "@/components/app/PasswordForm";
import { TallyLight } from "@/components/ui/TallyLight";

export default async function SettingsPage() {
  const user = await requireUser();
  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <TallyLight label="ACCOUNT" active={false} />
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">Settings</h1>
      </div>

      <div className="mb-8 cue-card max-w-md p-6 pl-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-mist">Signed in as</p>
        <p className="mt-1 font-display text-xl font-bold">{user.name}</p>
        <p className="text-sm text-ink/60">{user.email}</p>
      </div>

      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mist">Change password</p>
      <PasswordForm />
    </div>
  );
}
