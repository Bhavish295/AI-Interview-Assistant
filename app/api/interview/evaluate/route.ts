import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { evaluateSchema } from "@/lib/validators";
import { evaluateAnswer } from "@/lib/gemini";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = evaluateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Question and answer are required" }, { status: 400 });
  }

  const evaluation = await evaluateAnswer(parsed.data.question, parsed.data.answer);
  return NextResponse.json(evaluation);
}
