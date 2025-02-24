import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider, AuthModal } from "@/components/auth";
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
        url: "https://cuttypiedev.vercel.app/avatar.webp",
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
    images: ["https://cuttypiedev.vercel.app/avatar.webp"],
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
            <main className="bg-black text-white min-h-screen">{children}</main>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
