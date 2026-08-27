import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResultModel from "@/models/Result";
import { requireUser } from "@/lib/requireUser";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const { id } = await params;

  try {
    await connectDB();
    const result = await ResultModel.findOne({ _id: id, userId: user._id }).lean();
    if (!result) return NextResponse.json({ message: "Session not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch result error:", error);
    return NextResponse.json({ message: "Could not load this session" }, { status: 500 });
  }
}
