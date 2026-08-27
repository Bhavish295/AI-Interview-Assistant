import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { analyzeResume } from "@/lib/gemini";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("resume");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "No resume file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ message: "Only PDF resumes are supported" }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "Resume must be smaller than 5MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { default: pdfParse } = await import("pdf-parse");
    const parsed = await pdfParse(buffer);
    const text = parsed.text.trim();

    if (!text) {
      return NextResponse.json({ message: "Could not read text from this PDF" }, { status: 422 });
    }

    const insight = await analyzeResume(text);

    return NextResponse.json({
      excerpt: text.slice(0, 800),
      insight,
    });
  } catch (error) {
    console.error("Resume parse error:", error);
    return NextResponse.json({ message: "Could not process this resume" }, { status: 500 });
  }
}
