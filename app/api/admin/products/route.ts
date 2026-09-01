import { requireAdminApi } from "@/lib/admin-auth/admin-api";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) {
    return authError;
  }

  try {
    const products = await client.fetch(
      `*[_type == "product"] | order(_createdAt desc) {
        _id,
        name,
        slug,
        sku,
        images,
        price,
        regularPrice,
        category->{
          _id,
          title
        },
        variant,
        color,
        sizeStock,
        status,
        isFeatured,
        isActive
      }`,
    );

    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error("Admin products fetch error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}
