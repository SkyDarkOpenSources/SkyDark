import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SkyDark",
  description:
    "A space-tech company aiming to build drones, rockets and aircrafts for the future of humanity",
  openGraph: {
    title: "SkyDark",
    description:
      "A space-tech company aiming to build drones, rockets and aircrafts for the future of humanity",
    images: [
      {
        url: "https://www.skydark.net/favicon.ico",
      },
    ],
  },
  twitter: {
    title: "SkyDark",
    description:
      "A space-tech company aiming to build drones, rockets and aircrafts for the future of humanity",
    images: [
      {
        url: "https://www.skydark.net/favicon.ico",
      },
    ],
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <html lang="en" suppressHydrationWarning className={inter.className}>
          <head />
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
