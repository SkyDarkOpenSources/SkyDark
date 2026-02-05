"use client"

import Image from "next/image"
import type * as React from "react"
import { Search, Home, UserRound, NewspaperIcon, Book, Cloud, Layers } from "lucide-react"
import Link from "next/link"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Navigation items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Cloud Storage",
    url: "/dashboard/cloud-storage",
    icon: Cloud,
  },
  {
    title: "Search Users",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: NewspaperIcon,
  },
  {
    title: "Clubs",
    url: "/dashboard/clubs",
    icon: Book,
  },
]

const settingsItems = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserRound,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isEmployee?: boolean
}

export function AppSidebar({ isEmployee = false, ...props }: AppSidebarProps) {
  const filteredItems = items.filter(item => {
    if (item.title === "Search Users") {
      return isEmployee;
    }
    return true;
  });

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">
                <Image src="/favicon.ico" alt="SkyDark Logo" width={24} height={24} className="h-6 w-6" />
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item) => (

                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  )
}
