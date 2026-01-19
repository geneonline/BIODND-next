import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google"; // Keeping Geist as primary but user can override via CSS logic
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Providers } from "@/components/Providers";
import "@/i18n";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIODND - Empower Your Decisions with Life Science Company Database & Market Research",
  description: "Make smarter decisions with BIODND, your go-to resource for life science data, regulatory insights, and industry trends tailored for leaders in biotechnology and pharmaceuticals. Streamline your deal sourcing effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased m-0 p-0 box-border w-full bg-white leading-tight min-w-[320px] font-Inter`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Footer />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
