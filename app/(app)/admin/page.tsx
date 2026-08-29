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
        <TallyLight label="Admin" />
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Question list
        </h1>
        <p className="mt-2 text-mist">Add or remove questions that people see in practice interviews.</p>
      </div>
      <AdminQuestions />
    </div>
  );
}
