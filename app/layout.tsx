import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Urbanist } from "next/font/google";
import { Toaster } from "sonner";

import "../style/index.css";
import MetaPixel from "@/components/MetaPixel";

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

          <Toaster
            position="bottom-right"
            expand={false}
            closeButton
            duration={3000}
            toastOptions={{
              classNames: {
                toast:
                  "border border-black/10 bg-[var(--eon-cream)] text-[var(--eon-ink)] shadow-[0_18px_50px_rgba(0,0,0,0.10)] rounded-[var(--eon-radius-sm)] px-4 py-3",
                title: "font-semibold tracking-[-0.01em]",
                description: "text-[var(--eon-neutral-700)]",
                actionButton:
                  "bg-[var(--eon-ink)] text-white hover:bg-[var(--eon-ink-soft)]",
                cancelButton:
                  "border border-black/10 bg-transparent text-[var(--eon-ink)]",
                closeButton:
                  "!border-black/10 !bg-transparent !text-[var(--eon-neutral-500)] hover:!text-[var(--eon-ink)]",
                success: "!border-[var(--eon-red)]/20 !bg-[var(--eon-cream)]",
                error: "!border-red-900/15 !bg-[var(--eon-cream)]",
              },
            }}
          />
        </ClerkProvider>
      </body>
    </html>
  );
}
