import type React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SkyDark | Dashboard",
  description:
    "SkyDark dashboard. View upcoming events, news, profile, search for other users. Manage your account and explore the world of space-tech and beyond.",
  openGraph: {
    title: "SkyDark",
    description:
      "SkyDark dashboard. View upcoming events, news, profile, search for other users. Manage your account and explore the world of space-tech and beyond.",
    url: "https://www.skydark.net/dashboard",
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
      "SkyDark dashboard. View upcoming events, news, profile, search for other users. Manage your account and explore the world of space-tech and beyond.",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
