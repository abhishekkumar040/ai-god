'use client'

import React, { useState } from 'react'
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
import { AppWindow, Bot, Play, Blocks, Layers, Settings, User, Clock, TrendingUp, LayoutDashboard } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { UserButton } from '@clerk/nextjs'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'bg-blue-500/20 text-blue-500', border: 'border-blue-500/30' },
    { name: 'Agents', href: '/dashboard/agents', icon: Bot, color: 'bg-green-500/20 text-green-500', border: 'border-green-500/30' },
    { name: 'Runs', href: '/dashboard/agents', icon: Clock, color: 'bg-orange-500/20 text-orange-500', border: 'border-orange-500/30' },
    { name: 'Integrations', href: '/dashboard/agents', icon: Blocks, color: 'bg-purple-500/20 text-purple-500', border: 'border-purple-500/30' },
    { name: 'Templates', href: '/dashboard/agents', icon: Layers, color: 'bg-rose-500/20 text-rose-500', border: 'border-rose-500/30' },
]

const USER_ITEMS = [
    { name: 'Settings', icon: Settings },
    { name: 'Profile', icon: User },
    { name: 'Activity', icon: TrendingUp },
]

export function AppSidebar() {
    const path = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false)

    const isActive = (href: string) => path === href || path.startsWith(href + '/')

    return (
        <Sidebar className="w-72 transition-all duration-300">
            {/* Sidebar Header */}
            <SidebarHeader className="flex flex-row gap-2.5 items-center px-4 py-6 border-b border-slate-700 bg-[#0f0f14]">
                <Image src="/logo.svg" alt="logo" width={36} height={36} className="rounded-lg" />
                <div>
                    <h2 className="font-bold text-xl text-white tracking-tight">Groovy AI</h2>
                    <p className="text-xs text-slate-400 font-medium">Agent Workspace</p>
                </div>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent className="bg-[#0a0a0f]">
                {/* Workspace Group */}
                <SidebarGroup className="px-2 py-4">
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                        Workspace
                    </SidebarGroupLabel>

                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <SidebarMenuButton
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={`
                                    h-11 gap-3 rounded-xl px-3 transition-all duration-200
                                    ${active
                                        ? 'bg-blue-500/10 text-blue-400 border-r-2 border-blue-500 shadow-lg shadow-blue-500/20'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border-r-2 border-transparent'
                                    }
                                `}
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color} ${item.border}">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">{item.name}</span>
                            </SidebarMenuButton>
                        )
                    })}
                </SidebarGroup>

                {/* User Group */}
                <SidebarGroup className="px-2 py-4 mt-6 border-t border-slate-700">
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                        Account
                    </SidebarGroupLabel>

                    {USER_ITEMS.map((item) => (
                        <SidebarMenuButton
                            key={item.name}
                            onClick={() => router.push('/dashboard/agents')}
                            className="h-11 gap-3 rounded-xl px-3 transition-all duration-200 text-slate-300 hover:bg-slate-800/50 hover:text-white border-r-2 border-transparent"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/50 text-slate-400">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">{item.name}</span>
                        </SidebarMenuButton>
                    ))}
                </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="p-4 flex flex-col gap-3 border-t border-slate-700 bg-[#0a0a0f]">
                <div className="flex items-center justify-between px-2">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-400">
                            <span>Active Agents</span>
                            <span className="text-green-400 font-bold">3</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[65%] rounded-full" />
                        </div>
                    </div>
                    <div className="ml-3 text-right">
                        <div className="text-xs font-bold text-white">66%</div>
                        <div className="text-[10px] text-slate-500">utilization</div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2 mt-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Abhishek Kumar</p>
                            <p className="text-xs text-slate-400">admin@groovy.ai</p>
                        </div>
                    </div>
                    <UserButton
                        mode="popover"
                        afterSignOutUrl="/sign-in"
                        appearance={{
                            elements: {
                                popover: 'bg-[#0f0f14] border border-slate-700 rounded-2xl shadow-2xl p-2',
                                dropdownIndicator: 'text-slate-400',
                                userButton: 'bg-transparent hover:bg-slate-800 rounded-full border-none px-2 py-1',
                            },
                        }}
                    />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
