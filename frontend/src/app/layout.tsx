import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scam Kavach — Smart Scam Detection for Students & Job Seekers",
  description:
    "Protect students and job seekers against fraudulent job offers, advance-fee onboarding scams, Telegram task traps, and malicious recruitment links using calibrated heuristics and verification workflows.",
  keywords: [
    "job scam detector",
    "internship scam detector",
    "recruitment fraud detection",
    "student job safety",
    "advance fee job scam",
    "offer letter verification",
    "scam kavach",
    "scamkavach"
  ],
  authors: [{ name: "Scam Kavach Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#07090D] text-[#F5F7FA] font-sans selection:bg-[#FFC247] selection:text-[#07090D]">
        {children}
      </body>
    </html>
  );
}
