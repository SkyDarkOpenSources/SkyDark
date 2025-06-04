import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/page";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Navbar />
        <div className="absolute top-0 bottom-0 z-[-2] h-screen w-screen bg-neutral-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          {children}
        </div>
      </body>
    </html>
  );
}
