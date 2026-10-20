'use client'

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { AppWindow, Bot, Play, Blocks, Layers, Settings, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { UserButton } from '@clerk/nextjs'

export function AppSidebar() {
    const path = usePathname()
    const router = useRouter()

    return (
        <Sidebar>
            {/* Sidebar Header */}
            <SidebarHeader className="flex flex-row gap-2.5 items-center px-4 py-4">
                <Image src="/logo.svg" alt="logo" width={40} height={40} />
                <h2 className="font-semibold text-large text-slate-900">Groovy AI</h2>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent>
                {/* Workspace Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>

                    {/* Dashboard */}
                    <SidebarMenuButton
                        onClick={() => router.push('/dashboard')}
                        className={`h-12 gap-3 rounded-lg ${path === '/dashboard' ? 'bg-slate-100' : ''}`}
                    >
                        <div className="flex h-9 w-9 shrink-0 bg-blue-100 items-center justify-center rounded-lg">
                            <AppWindow className="h-[18px] w-[18px] text-blue-900" />
                        </div>
                        <span>Dashboard</span>
                    </SidebarMenuButton>

                    {/* Agents */}
                    <SidebarMenuButton
                        onClick={() => router.push('/dashboard/agents')}
                        className={`h-12 gap-3 rounded-lg ${path === '/dashboard/agents' ? 'bg-slate-100' : ''}`}
                    >
                        <div className="flex h-9 w-9 shrink-0 bg-green-100 items-center justify-center rounded-lg">
                            <Bot className="h-[18px] w-[18px] text-green-900" />
                        </div>
                        <span>Agents</span>
                    </SidebarMenuButton>

                    {/* Runs / Logs */}
                    <SidebarMenuButton
                        onClick={() => router.push('/dashboard/run')}
                        className={`h-12 gap-3 rounded-lg ${path === '/dashboard/run' ? 'bg-slate-100' : ''}`}
                    >
                        <div className="flex h-9 w-9 shrink-0 bg-red-100 items-center justify-center rounded-lg">
                            <Play className="h-[18px] w-[18px] text-red-900" />
                        </div>
                        <span>Runs</span>
                    </SidebarMenuButton>

                    {/* Integrations */}
                    <SidebarMenuButton
                        onClick={() => router.push('/dashboard/integration')}
                        className={`h-12 gap-3 rounded-lg ${path === '/dashboard/integration' ? 'bg-slate-100' : ''}`}
                    >
                        <div className="flex h-9 w-9 shrink-0 bg-purple-100 items-center justify-center rounded-lg">
                            <Blocks className="h-[18px] w-[18px] text-purple-900" />
                        </div>
                        <span>Integrations</span>
                    </SidebarMenuButton>

                    {/* Templates */}
                    <SidebarMenuButton
                        onClick={() => router.push('/dashboard/templates')}
                        className={`h-12 gap-3 rounded-lg ${path === '/dashboard/templates' ? 'bg-slate-100' : ''}`}
                    >
                        <div className="flex h-9 w-9 shrink-0 bg-orange-100 items-center justify-center rounded-lg">
                            <Layers className="h-[18px] w-[18px] text-orange-900" />
                        </div>
                        <span>Templates</span>
                    </SidebarMenuButton>
                </SidebarGroup>

                {/* User Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Users</SidebarGroupLabel>

                    {/* Settings */}
                    <SidebarMenuButton className="h-12 gap-3 rounded-lg hover:bg-slate-100">
                        <div className="flex h-9 w-9 shrink-0 bg-gray-100 items-center justify-center rounded-lg">
                            <Settings className="h-[18px] w-[18px] text-gray-900" />
                        </div>
                        <span>Settings</span>
                    </SidebarMenuButton>

                    {/* Profile */}
                    <SidebarMenuButton className="h-12 gap-3 rounded-lg hover:bg-slate-100">
                        <div className="flex h-9 w-9 shrink-0 bg-yellow-100 items-center justify-center rounded-lg">
                            <User className="h-[18px] w-[18px] text-yellow-900" />
                        </div>
                        <span>Profile</span>
                    </SidebarMenuButton>
                </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="p-4 flex flex-col gap-2">
                <div className="border rounded-lg p-2 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span>Agents</span>
                        <span>3</span>
                    </div>
                    <Progress value={66} />
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span>Credits</span>
                        <span>100</span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                    <UserButton />
                    <span className="text-sm font-medium">Abhishek Kumar</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}