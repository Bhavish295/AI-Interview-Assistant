import { requireUser } from "@/lib/requireUser";
import { PasswordForm } from "@/components/app/PasswordForm";

export default async function SettingsPage() {
  const user = await requireUser();
  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-mist">Your account details</p>

      <div className="mb-8 mt-6 cue-card max-w-md p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-mist">Signed in as</p>
        <p className="mt-1 text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-mist">{user.email}</p>
      </div>

      <p className="mb-3 text-sm font-medium">Change password</p>
      <PasswordForm />
    </div>
  );
}
