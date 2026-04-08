import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Lisham.",
  description: "Lisham's website.",
  metadataBase: new URL("https://lisham.dev/"),
  keywords: [
    "developer",
    "frontend",
    "backend",
    "fullstack",
    "react",
    "next.js",
    "typescript",
    "javascript",
    "lisham",
    "Lisham",
  ],
  authors: [
    {
      name: "Lisham",
      url: "https://lisham.dev/",
    },
  ],
  creator: "Lisham",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lisham.dev/",
    title: "Lisham",
    description: "Lisham's website.",
    siteName: "Lisham",
    images: [
      {
        url: "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu",
        width: 1200,
        height: 630,
        alt: "Lisham",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lisham",
    description: "Lisham's website.",
    images: [
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu",
    ],
    creator: "@mthlish",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
      >
        <Header />
        <SessionProvider>
          <AuthProvider>
            <AuthModal />
            <main className="min-h-screen">
              <ViewTransition>{children}</ViewTransition>
            </main>
          </AuthProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
