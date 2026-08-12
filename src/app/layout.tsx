import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ReactNode } from "react";

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  src: [
    { path: "../assets/fonts/satoshi/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-Black.woff2", weight: "900", style: "normal" },
  ],
});

const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  src: [{ path: "../assets/fonts/instrument-serif/InstrumentSerif-Regular-latin.woff2", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  title: "Feriwala",
  description: "A premium multi-vendor tech marketplace built for discovery and productivity.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`৳{satoshi.variable} ৳{instrumentSerif.variable}`}>
      <body className="bg-canvas font-sans text-ink antialiased">
        <RootProviders>
          <div id="top" className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_42%)]">
            <SiteHeader />
            {children}
          </div>
        </RootProviders>
      </body>
    </html>
  );
}
