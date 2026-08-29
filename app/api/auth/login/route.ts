import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { loginSchema } from "@/lib/validators";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    await connectDB();

    const user = await UserModel.findOne({ email }).select("name email password role");
    if (!user) {
      return NextResponse.json({ message: "Incorrect email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Incorrect email or password" }, { status: 401 });
    }

    await setSessionCookie({ id: user._id.toString(), role: user.role, name: user.name });

    return NextResponse.json({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
