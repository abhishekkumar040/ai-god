"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserDetailContext } from "@/context/UserDetailContext";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { AppWindow, Blocks, Bot, Layers, Play, Settings, User2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useContext } from "react";
import { Progress } from "@/components/ui/progress";

const workspaceNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: AppWindow,
        bgColor: "bg-blue-100",
        textColor: "text-blue-900",
    },
    {
        title: "Agents",
        url: "/agents",
        icon: Bot,
        bgColor: "bg-red-100",
        textColor: "text-red-900",
    },
    {
        title: "Logs",
        url: "/logs",
        icon: Play,
        bgColor: "bg-green-100",
        textColor: "text-green-900",
    },
    {
        title: "Integration",
        url: "/integration",
        icon: Blocks,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-900",
    },
    {
        title: "Templates",
        url: "/templates",
        icon: Layers,
        bgColor: "bg-purple-100",
        textColor: "text-purple-900",
    },
];

const userNavItems = [
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        bgColor: "bg-gray-100",
        textColor: "text-gray-900",
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User2,
        bgColor: "bg-slate-100",
        textColor: "text-slate-900",
    },
];

export function AppSidebar() {
    const path = usePathname();
    const { userDetail } = useContext(UserDetailContext) || {};

    return (
        <Sidebar>
            <SidebarHeader className="flex flex-row gap-2.5 items-center px-4 py-3">
                <Image src="/logo.svg" alt="logo" width={36} height={36} />
                <h2 className="font-bold text-lg text-slate-900 tracking-wide">AI GOD</h2>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarMenu>
                        {workspaceNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = path === item.url || (item.url !== "/dashboard" && path.startsWith(item.url));
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        className={`h-12 gap-3 hover:bg-slate-100 ${isActive ? 'bg-slate-100 font-medium' : ''}`}
                                    >
                                        <Link href={item.url} className="flex items-center gap-3 w-full">
                                            <div className={`flex h-9 w-9 shrink-0 ${item.bgColor} items-center justify-center rounded-md`}>
                                                <Icon className={`h-[18px] w-[18px] ${item.textColor}`} />
                                            </div>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Users</SidebarGroupLabel>
                    <SidebarMenu>
                        {userNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = path.startsWith(item.url);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        className={`h-12 gap-3 hover:bg-slate-100 ${isActive ? 'bg-slate-100 font-medium' : ''}`}
                                    >
                                        <Link href={item.url} className="flex items-center gap-3 w-full">
                                            <div className={`flex h-9 w-9 shrink-0 ${item.bgColor} items-center justify-center rounded-md`}>
                                                <Icon className={`h-[18px] w-[18px] ${item.textColor}`} />
                                            </div>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3">
                <div className="p-3 border rounded-lg flex gap-2 flex-col bg-slate-50/50">
                    <h2 className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Agents</span>
                        <span className="font-semibold">{userDetail?.agentCredits ?? 0}/5</span>
                    </h2>
                    <h2 className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits</span>
                        <span className="font-semibold">{userDetail?.usageCredits ?? 0}</span>
                    </h2>
                    <Progress value={userDetail ? ((userDetail.agentCredits ?? 0) / 5) * 100 : 0} />
                </div>
                <div className="flex items-center gap-2.5 p-2 mt-1">
                    <UserButton />
                    <span className="text-sm font-medium truncate">{userDetail?.name ?? "User"}</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}