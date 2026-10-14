"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { UserDetailContext } from "@/context/UserDetailContext";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image"
import { AppWindow, Blocks, Bot, Layers, Play, Settings, User2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useContext } from "react";
import { Progress } from "@/components/ui/progress";

export function AppSidebar() {
    const path = usePathname();
    const { userDetail } = useContext(UserDetailContext);

    return (
        <Sidebar>
            <SidebarHeader className="flex flex-row gap-2.5 items-center px-4 py-2">
                <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
                <h2 className="font-bold text-lg text-slate-900 tracking-wide">AI GOD</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/dashboard') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-blue-100 items-center justify-center rounded-md">
                            <AppWindow className="h-[18px] w-[18px] text-blue-900" />
                        </div>
                        <span>Dashboard</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/Agents') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-red-100 items-center justify-center rounded-md">
                            <Bot className="h-[18px] w-[18px] text-red-900" />
                        </div>
                        <span>Agents</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/Logs') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-green-100 items-center justify-center rounded-md">
                            <Play className="h-[18px] w-[18px] text-green-900" />
                        </div>
                        <span>Logs</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/Integration') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-yellow-100 items-center justify-center rounded-md">
                            <Blocks className="h-[18px] w-[18px] text-yellow-900" />
                        </div>
                        <span>Integration</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/Templates') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-purple-100 items-center justify-center rounded-md">
                            <Layers className="h-[18px] w-[18px] text-purple-900" />
                        </div>
                        <span>Templates</span>
                    </SidebarMenuButton>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>User's</SidebarGroupLabel>
                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/Settings') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-gray-100 items-center justify-center rounded-md">
                            <Settings className="h-[18px] w-[18px] text-gray-900" />
                        </div>
                        <span>Settings</span>
                    </SidebarMenuButton>

                    <SidebarMenuButton className={`h-12 gap-3 hover:bg-slate-100 ${path.includes('/Profile') ? 'bg-slate-100' : ''}`}>
                        <div className="flex h-9 w-9 shrink-0 bg-slate-100 items-center justify-center rounded-md">
                            <User2 className="h-[18px] w-[18px] text-slate-900" />
                        </div>
                        <span>Profile</span>
                    </SidebarMenuButton>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-2 border rounded-lg flex gap-2 flex-col">
                    <h2 className="flex justify-between">Agents <span>{userDetail?.agentCredits}/5</span></h2>
                    <h2 className="flex justify-between">Credits <span>{userDetail?.usageCredits}</span></h2>
                    <Progress value={66} />
                </div>
                <div className="flex items-center gap-2.5 p-2 mt-2">
                    <UserButton />
                    <span>{userDetail?.name}</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}