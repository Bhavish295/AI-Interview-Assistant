export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { connectDB } = await import("./lib/db");
  connectDB().catch((err) => {
    console.error("Mongo warmup failed:", err);
  });
}
