import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header/Header";
import { getShopCategories } from "@/sanity/helpers/queries";
import { Toaster } from "react-hot-toast";



export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getShopCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />

      <main className="flex-1">{children}</main>

      <Footer />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}