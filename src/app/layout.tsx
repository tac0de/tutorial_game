import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React TypeScript Tutorial Game - Interactive Learning Platform",
  description: "An interactive tutorial game for learning React and TypeScript. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["React", "TypeScript", "Tutorial", "Game", "Learning", "Next.js", "Tailwind CSS", "shadcn/ui", "Interactive"],
  authors: [{ name: "Tutorial Game Developer" }],
  openGraph: {
    title: "React TypeScript Tutorial Game",
    description: "Interactive learning platform for React and TypeScript",
    url: "https://your-github-username.github.io/tutorial_game",
    siteName: "React TypeScript Tutorial Game",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "React TypeScript Tutorial Game",
    description: "Interactive learning platform for React and TypeScript",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
