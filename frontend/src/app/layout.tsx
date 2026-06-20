import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

const elegantFont = Playfair_Display({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-cursive" });

export const metadata: Metadata = {
  title: "Hire.me - Your Unified Professional Identity",
  description: "Aggregates your resume, GitHub, LinkedIn, X/Twitter, and best project demos with video previews into a single shareable link for modern recruiters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${elegantFont.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
