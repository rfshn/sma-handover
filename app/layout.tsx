import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SMA Handover Ceremony | Sunway Maldivian Association",
  description: "Official Committee Handover Ceremony for the Sunway Maldivian Association Annual General Meeting 2026",
  keywords: ["SMA", "Sunway", "Maldivian", "Association", "AGM", "Handover", "Ceremony"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
