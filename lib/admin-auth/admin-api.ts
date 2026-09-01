import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireAdminApi() {
  const { userId } = await auth();

  // User is not logged in
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  // User is logged in but isn't the EON admin
  if (userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  // Authorized admin
  return null;
}