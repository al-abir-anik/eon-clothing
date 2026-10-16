import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import AdminShell from "./admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const role = user.publicMetadata?.role;

  if (role !== "admin") {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
