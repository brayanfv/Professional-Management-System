import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { AppProviders } from "@/providers/app-providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Professional Management System",
  description: "Professional management platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
