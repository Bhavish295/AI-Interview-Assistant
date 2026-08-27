import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { AppShell } from "@/components/app/AppShell";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (!user) redirect("/login");

  return <AppShell user={{ name: user.name, role: user.role }}>{children}</AppShell>;
}
