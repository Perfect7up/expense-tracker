import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/app/core/components/ui/sonner";
import { Providers } from "./core/providers/providers";

export const metadata: Metadata = {
  title: {
    default: "FinanciAI – Smart Financial Management",
    template: "%s | FinanciAI",
  },
  description:
    "FinanciAI is an AI-powered expense tracker that helps you manage expenses, income, investments, and financial reports intelligently.",
  keywords: [
    "expense tracker",
    "AI finance",
    "financial management",
    "budget planner",
    "income tracking",
    "Next.js finance app",
    "FinanciAI",
  ],
  authors: [{ name: "FinanciAI Team" }],
  creator: "FinanciAI",
  applicationName: "FinanciAI",

  metadataBase: new URL("https://expensemanagement-ai.vercel.app/"), // 🔁 change to your real domain

  openGraph: {
    title: "FinanciAI – Smart Financial Management",
    description:
      "AI-powered financial management app to track expenses, income, and investments with smart insights.",
    url: "https://expensemanagement-ai.vercel.app/",
    siteName: "FinanciAI",
    images: [
      {
        url: "/og-image.png", // add this image in /public
        width: 1200,
        height: 630,
        alt: "FinanciAI – Smart Financial Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "FinanciAI – Smart Financial Management",
    description:
      "Track expenses, income, and investments with AI-powered insights.",
    images: ["/og-image.png"],
    creator: "@financiai", // optional
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
