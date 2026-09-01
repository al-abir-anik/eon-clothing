import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { cn } from "@/lib/utils";
import "../style/index.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - EON Clothing",
    default: "EON Clothing",
  },
  description: "EON Clothing online store, Your one stop shop for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-urbanist", urbanist.className)}>
      <body className={` antialiased`}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
