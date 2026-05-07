"use client"

import * as React from "react"
import { LayoutDashboard, GalleryHorizontalEnd, Mail } from "lucide-react"
import { NavMain } from "@/components/nav/nav-main"
import { NavUser } from "@/components/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  totalPosts?: number
}

export function AppSidebar({ totalPosts = 0, ...props }: AppSidebarProps) {
  const navData = React.useMemo(() => ({
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Postes récupérés",
        url: "/posts",
        icon: GalleryHorizontalEnd,
        counter: totalPosts
      },
      {
        title: "Nous contactez",
        url: "/contact",
        icon: Mail ,
      }
    ]
  }), [totalPosts])

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-12">
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/logo.svg" alt="logo" width={24} height={24} />
                </div>
                {/* Le texte disparaît automatiquement grâce au CSS de SidebarMenuButton si configuré */}
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Seeklead</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}