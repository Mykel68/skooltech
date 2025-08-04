import type { Metadata } from "next";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import PWAServiceWorker from "@/utils/register-sw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skooltech",
  description:
    "SkoolTech is an all-in-one school management platform that simplifies student records, teacher tasks, exams, and admin operations — built for modern Nigerian schools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-right" richColors />
        <PWAServiceWorker />
      </body>
    </html>
  );
}
