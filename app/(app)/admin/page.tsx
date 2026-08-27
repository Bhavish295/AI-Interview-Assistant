import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { AdminQuestions } from "@/components/app/AdminQuestions";
import { TallyLight } from "@/components/ui/TallyLight";

export default async function AdminPage() {
  const user = await requireUser();
  if (!user || user.role !== "admin") redirect("/dashboard");

  return (
    <div>
      <div className="mb-8">
        <TallyLight label="ADMIN" />
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Question bank
        </h1>
        <p className="mt-2 text-mist">Curate the questions candidates see across every track.</p>
      </div>
      <AdminQuestions />
    </div>
  );
}
