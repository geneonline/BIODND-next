import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keeping Geist as primary but user can override via CSS logic
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Providers } from "@/components/Providers";
import "@/i18n";

// ... (Geist definitions) ...

export const metadata: Metadata = {
  title: "BIODND Next",
  description: "Migrated BIODND Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 box-border w-full bg-white leading-tight min-w-[320px] font-Inter`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
