import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";

import { AuthModal, AuthProvider } from "@/components/auth";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lisham_",
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
    "lisham_",
  ],
  authors: [
    {
      name: "lisham_",
      url: "https://lisham.dev/",
    },
  ],
  creator: "lisham_",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lisham.dev/",
    title: "lisham_",
    description: "Lisham's website.",
    siteName: "lisham_",
    images: [
      {
        url: "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu",
        width: 1200,
        height: 630,
        alt: "lisham_",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "lisham_",
    description: "Lisham's website.",
    images: [
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu",
    ],
    creator: "@mthlish",
  },
};

export default function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <AuthProvider>
            <AuthModal />
            <main className="min-h-screen">
              <ViewTransition>{children}</ViewTransition>
            </main>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
