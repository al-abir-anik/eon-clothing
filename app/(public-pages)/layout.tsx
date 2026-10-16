import type { ReactNode } from "react";

import { CartProviderWrapper } from "@/components/cart/cart-provider-wrapper";
import { getNavigationCategories } from "@/lib/ecommerce/catalog/category-catalog";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function PublicPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categories = await getNavigationCategories();

  return (
    <CartProviderWrapper>
      <div className="min-h-screen">
        <Header categories={categories} />

        <main>{children}</main>

        <Footer />
      </div>
    </CartProviderWrapper>
  );
}
