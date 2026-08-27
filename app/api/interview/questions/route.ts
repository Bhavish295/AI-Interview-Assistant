import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QuestionModel from "@/models/Question";
import { requireUser } from "@/lib/requireUser";

export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const track = searchParams.get("track");
  const difficulty = searchParams.get("difficulty");

  const filter: Record<string, string> = {};
  if (track && track !== "Custom Role") filter.track = track;
  if (difficulty && difficulty !== "Mixed") filter.difficulty = difficulty;

  try {
    await connectDB();
    const questions = await QuestionModel.aggregate([
      { $match: filter },
      { $sample: { size: 5 } },
      { $project: { question: 1, keywords: 1, track: 1, difficulty: 1 } },
    ]);

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Fetch questions error:", error);
    return NextResponse.json({ message: "Could not load questions" }, { status: 500 });
  }
}
