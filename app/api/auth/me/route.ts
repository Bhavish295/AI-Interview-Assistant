import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  return NextResponse.json({ name: user.name, email: user.email, role: user.role });
}
