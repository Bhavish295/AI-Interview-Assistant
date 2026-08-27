import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import type { User } from "@/models/User";

type AdminGuardResult = { error?: NextResponse; user?: User };

export async function requireAdmin(): Promise<AdminGuardResult> {
  const user = await requireUser();
  if (!user) return { error: NextResponse.json({ message: "Not signed in" }, { status: 401 }) };
  if (user.role !== "admin") return { error: NextResponse.json({ message: "Admins only" }, { status: 403 }) };
  return { user };
}
