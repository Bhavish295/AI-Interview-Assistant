import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QuestionModel from "@/models/Question";
import { requireAdmin } from "@/lib/requireAdmin";
import { questionUpdateSchema } from "@/lib/validators";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = questionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid update" }, { status: 400 });
  }

  await connectDB();
  const question = await QuestionModel.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!question) return NextResponse.json({ message: "Question not found" }, { status: 404 });
  return NextResponse.json(question);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await connectDB();
  await QuestionModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Question deleted" });
}
