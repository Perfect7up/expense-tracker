import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/app/core/components/ui/sonner";
import { Providers } from "./core/providers/providers";

export const metadata: Metadata = {
  title: "FinanciAI - Smart Financial Management",
  description: "AI-powered financial management and expense tracking",
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
