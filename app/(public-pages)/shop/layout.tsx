import Container from "@/components/layout/Container";
import ShopSidebar from "@/components/ShopSidebar";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import React, { Suspense } from "react";

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="py-10 flex flex-col sm:flex-row items-start gap-4 xl:gap-8">
      <aside>
        <ShopSidebar />
      </aside>

      <Suspense fallback={<ProductGridSkeleton />}>{children}</Suspense>
    </Container>
  );
};

export default ShopLayout;
