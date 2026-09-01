import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const { userId } = await auth();

  // Not logged in
  if (!userId) {
    redirect("/sign-in");
  }

  // Logged in but NOT the admin
  if (userId !== process.env.ADMIN_USER_ID) {
    redirect("/");
  }

  return userId;
}