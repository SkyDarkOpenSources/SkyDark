import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ClerkProvider } from '@clerk/nextjs';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyDark | Home",
  description:
    "Space-tech company, aiming to build drones, model rockets, robots, and more. From building basic robots to launching rockets, we do it all. Join us in our journey to explore the world of tech and beyond.",
  openGraph: {
    title: "SkyDark",
    description:
      "Space-tech company, aiming to build drones, model rockets, robots, and more. From building basic robots to launching rockets, we do it all. Join us in our journey to explore the world of tech and beyond.",
    url: "https://www.skydark.net",
    siteName: "SkyDark",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "SkyDark",
    description:
      "Space-tech company, aiming to build drones, model rockets, robots, and more. From building basic robots to launching rockets, we do it all. Join us in our journey to explore the world of tech and beyond.",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
