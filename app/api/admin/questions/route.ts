import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QuestionModel from "@/models/Question";
import { requireAdmin } from "@/lib/requireAdmin";
import { questionSchema } from "@/lib/validators";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const questions = await QuestionModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const { error, user } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid question" }, { status: 400 });
  }

  await connectDB();
  const question = await QuestionModel.create({ ...parsed.data, createdBy: user?._id });
  return NextResponse.json(question, { status: 201 });
}
