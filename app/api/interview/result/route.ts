import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResultModel from "@/models/Result";
import { requireUser } from "@/lib/requireUser";
import { saveResultSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = saveResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid result" }, { status: 400 });
  }

  try {
    await connectDB();
    const result = await ResultModel.create({
      userId: user._id,
      ...parsed.data,
    });
    return NextResponse.json({ id: result._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Save result error:", error);
    return NextResponse.json({ message: "Could not save your session" }, { status: 500 });
  }
}

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  try {
    await connectDB();
    const results = await ResultModel.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(results);
  } catch (error) {
    console.error("Fetch results error:", error);
    return NextResponse.json({ message: "Could not load your history" }, { status: 500 });
  }
}
