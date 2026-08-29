import { cache } from "react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel, { type User } from "@/models/User";

// One DB lookup per request even if layout + page both call this.
export const requireUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;
  await connectDB();
  const user = await UserModel.findById(session.id).select("name email role").lean();
  return user as User | null;
});
