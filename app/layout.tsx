import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";

import { AuthModal, AuthProvider } from "@/components/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import Header from "@/components/shared/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matheo (cuttypie)",
  description: "matheo's website.",
  metadataBase: new URL("https://cuttypiedev.vercel.app/"),
  keywords: [
    "developer",
    "frontend",
    "backend",
    "fullstack",
    "react",
    "next.js",
    "typescript",
    "javascript",
    "cuttypie",
  ],
  authors: [
    {
      name: "cuttypie",
      url: "https://cuttypiedev.vercel.app/",
    },
  ],
  creator: "cuttypie",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cuttypiedev.vercel.app/",
    title: "Matheo (cuttypie)",
    description: "matheo's website.",
    siteName: "Matheo (cuttypie)",
    images: [
      {
        url: "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu",
        width: 1200,
        height: 630,
        alt: "Matheo (cuttypie)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matheo (cuttypie)",
    description: "matheo's website.",
    images: [
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu",
    ],
    creator: "@DorianTho5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
      >
        <Header />
        <SessionProvider>
          <AuthProvider>
            <AuthModal />
            <main className="bg-black text-white min-h-screen">
              <ViewTransition>{children}</ViewTransition>
            </main>
          </AuthProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
