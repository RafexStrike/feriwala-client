import type { Metadata } from "next";
import "./globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Feriwala",
  description: "A premium multi-vendor tech marketplace built for discovery and productivity.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink antialiased">
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
