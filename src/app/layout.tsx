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
  description: "A Space-Tech company aiming to build model rockets, drones, robotics and more. All projects are open-source and available on GitHub.",
  openGraph: {
    title: "SkyDark",
    description: "A Space-Tech company aiming to build model rockets, drones, robotics and more. All projects are open-source and available on GitHub.",
    url: "https://www.skydark.net",
    type: "website",
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
          {children}
      </body>
    </html>
  );
}
