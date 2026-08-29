import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Interview Portal — Practice interviews",
  description: "Practice job interviews with an AI interviewer. Pick a topic, answer questions, and get a clear score.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} font-body bg-paper text-ink`}>{children}</body>
    </html>
  );
}
