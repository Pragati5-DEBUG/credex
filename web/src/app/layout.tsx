import type { Metadata } from "next";
import { PRODUCT_NAME } from "@/lib/product-brand";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${PRODUCT_NAME} — AI spend audit`,
  description:
    "Rule-based AI tool spend audit — stack snapshot, savings math, shareable report.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
