import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel, { type User } from "@/models/User";

export async function requireUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  await connectDB();
  const user = await UserModel.findById(session.id).lean();
  return user as User | null;
}
