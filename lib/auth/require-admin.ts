import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const role = user.publicMetadata?.role;

  if (role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}