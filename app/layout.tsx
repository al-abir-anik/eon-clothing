import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Urbanist } from "next/font/google";
import { Toaster } from "sonner";
import MetaPixel from "@/components/MetaPixel";
import "../style/index.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),

  title: {
    default: "EON Clothing",
    template: "%s | EON Clothing",
  },

  description:
    "EON Clothing — contemporary street fashion made for your everyday era.",

  applicationName: "EON Clothing",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "EON Clothing",
    title: "EON Clothing",
    description: "Contemporary street fashion made for your everyday era.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EON Clothing",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EON Clothing",
    description: "Contemporary street fashion made for your everyday era.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF8E9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning */}
      <body className={`${urbanist.variable} min-h-screen antialiased`}>
        <MetaPixel />

        <ClerkProvider>
          {children}

          {/* <Toaster
            position="bottom-center"
            expand={false}
            duration={2500}
            toastOptions={{
              classNames: {
                toast:
                  "!w-fit !min-w-0 !max-w-[calc(100vw-32px)] rounded border px-4 py-3 shadow-lg !text-white",
                title: "text-sm font-semibold tracking-normal !text-white",
                description: "hidden",
                success: "!border-green-600 !bg-green-700 !text-white",
                error: "!border-red-600 !bg-red-700 !text-white",
                info: "!border-blue-600 !bg-blue-700 !text-white",
                warning: "!border-amber-500 !bg-amber-600 !text-white",
                actionButton: "!bg-white !text-neutral-900",
                cancelButton: "!border-white/30 !bg-transparent !text-white",
              },
            }}
          /> */}
        </ClerkProvider>
      </body>
    </html>
  );
}
