import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { signupSchema } from "@/lib/validators";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  try {
    await connectDB();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 8);
    const user = await UserModel.create({ name, email, password: hashed, role: "user" });

    await setSessionCookie({ id: user._id.toString(), role: user.role, name: user.name });

    return NextResponse.json({ name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
