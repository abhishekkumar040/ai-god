'use client'

import React, { useEffect, useState, useCallback } from 'react'
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
import {
    Bot,
    Clock,
    Blocks,
    Layers,
    Settings,
    TrendingUp,
    LayoutDashboard,
    Plus,
    Sparkles,
    CheckCircle2,
    X,
    ExternalLink,
    Zap,
    Radio,
    ShieldCheck
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import axios from 'axios'

/* ------------------------------------------------------------------ */
/* Navigation items with glass accents                                */
/* ------------------------------------------------------------------ */

type NavKey = 'dashboard' | 'agents' | 'runs' | 'integrations' | 'templates'

const NAV_ITEMS: {
    id: NavKey
    name: string
    href: string
    icon: React.ElementType
    accentGlow: string
    iconColor: string
}[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        accentGlow: 'from-blue-500/20 to-cyan-500/10',
        iconColor: 'text-cyan-400 group-hover:text-cyan-300'
    },
    {
        id: 'agents',
        name: 'Agents',
        href: '/dashboard/agents',
        icon: Bot,
        accentGlow: 'from-blue-600/25 to-violet-600/20',
        iconColor: 'text-blue-400 group-hover:text-blue-300'
    },
    {
        id: 'runs',
        name: 'Runs',
        href: '/dashboard/agents',
        icon: Clock,
        accentGlow: 'from-amber-500/20 to-orange-500/10',
        iconColor: 'text-amber-400 group-hover:text-amber-300'
    },
    {
        id: 'integrations',
        name: 'Integrations',
        href: '/dashboard/agents',
        icon: Blocks,
        accentGlow: 'from-purple-500/20 to-fuchsia-500/10',
        iconColor: 'text-purple-400 group-hover:text-purple-300'
    },
    {
        id: 'templates',
        name: 'Templates',
        href: '/dashboard/agents',
        icon: Layers,
        accentGlow: 'from-rose-500/20 to-pink-500/10',
        iconColor: 'text-rose-400 group-hover:text-rose-300'
    },
]

const INTEGRATIONS_LIST = [
    { name: "Google Calendar", category: "Productivity", connected: true, icon: "📅" },
    { name: "Gmail", category: "Email", connected: true, icon: "✉️" },
    { name: "Slack", category: "Messaging", connected: true, icon: "💬" },
    { name: "SerpAPI Search", category: "Web Research", connected: true, icon: "🔍" },
    { name: "Reddit Trends", category: "Social Intel", connected: true, icon: "🤖" },
    { name: "Browserbase", category: "Web Automation", connected: true, icon: "🌐" },
    { name: "Discord", category: "Alerts", connected: false, icon: "🎮" },
    { name: "GitHub", category: "Developer", connected: false, icon: "🐙" },
    { name: "Outlook", category: "Email", connected: false, icon: "📧" },
]

const TEMPLATES_LIST = [
    { title: "Find the latest jobs", desc: "Searches web & career pages for high-signal matches every morning.", tools: ["SerpAPI", "Slack"] },
    { title: "Daily inbox summary", desc: "Summarizes unread emails and surfaces key action items.", tools: ["Gmail", "Slack"] },
    { title: "Research a topic", desc: "Gathers web intel and delivers clean markdown briefs.", tools: ["SerpAPI", "Browserbase"] },
    { title: "Plan my day", desc: "Inspects Google Calendar and builds a prioritized schedule.", tools: ["Google Calendar", "Gmail"] },
]

export function AppSidebar() {
    const path = usePathname()
    const router = useRouter()
    const { user, isLoaded } = useUser()

    // Real-time metrics
    const [totalAgents, setTotalAgents] = useState<number>(0)
    const [activeAgents, setActiveAgents] = useState<number>(0)
    const [recentRunsCount, setRecentRunsCount] = useState<number>(0)
    const [loadingStats, setLoadingStats] = useState<boolean>(true)

    // Interactive Modals
    const [activeModal, setActiveModal] = useState<'integrations' | 'templates' | 'runs' | 'settings' | null>(null)

    const fetchLiveStats = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/agents')
            const list: any[] = data.agents ?? []
            setTotalAgents(list.length)
            const active = list.filter((a) => a.isActive).length
            setActiveAgents(active)
            setRecentRunsCount(list.filter((a) => a.lastRunAt).length)
        } catch {
            // Silently handle if unauthenticated
        } finally {
            setLoadingStats(false)
        }
    }, [])

    useEffect(() => {
        fetchLiveStats()
        // Real-time polling every 15 seconds
        const timer = setInterval(fetchLiveStats, 15000)
        return () => clearInterval(timer)
    }, [fetchLiveStats])

    const isActive = (href: string) => path === href || path.startsWith(href + '/')

    // Max quota is 5 agents on standard tier
    const maxQuota = 5
    const utilizationPct = Math.min(100, Math.round((activeAgents / maxQuota) * 100))

    const handleNavClick = (item: typeof NAV_ITEMS[number]) => {
        if (item.id === 'integrations') {
            setActiveModal('integrations')
            return
        }
        if (item.id === 'templates') {
            setActiveModal('templates')
            return
        }
        if (item.id === 'runs') {
            setActiveModal('runs')
            return
        }
        router.push(item.href)
    }

    return (
        <>
            <Sidebar className="w-72 border-r border-white/10 transition-all duration-300 relative z-30 overflow-hidden bg-[#070619]/90 backdrop-blur-2xl text-slate-100 shadow-[0_8px_32px_rgba(2,0,30,0.6)]">
                {/* Ambient dynamic glass lighting behind content */}
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-24 -left-16 h-56 w-56 rounded-full bg-blue-600/20 blur-[75px]" />
                    <div className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-violet-600/20 blur-[85px]" />
                    <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-cyan-600/15 blur-[80px]" />
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                </div>

                {/* Sidebar Header */}
                <SidebarHeader className="flex flex-col gap-3 px-4 pt-5 pb-4 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <div
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-600/40 p-0.5 border border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                                <Image src="/logo.svg" alt="Groovy AI" width={28} height={28} className="rounded-lg object-contain" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-base text-white tracking-tight group-hover:text-blue-300 transition-colors">
                                        Groovy AI
                                    </h2>
                                    <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.2 text-[10px] font-semibold text-blue-300">
                                        v3.8
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium">Agent Architecture</p>
                            </div>
                        </div>

                        {/* Real-time system beacon */}
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5" title="AI Network Live">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
                        </div>
                    </div>

                    {/* Quick Action: New Agent Button */}
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/agents')}
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-gradient-to-r from-blue-600/90 to-violet-600/90 hover:from-blue-500 hover:to-violet-500 px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_4px_20px_-4px_rgba(79,70,229,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Agent</span>
                    </button>
                </SidebarHeader>

                {/* Sidebar Navigation */}
                <SidebarContent className="px-3 py-4 space-y-6 bg-transparent">
                    {/* Workspace Navigation Group */}
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel className="text-[11px] font-bold text-slate-400/80 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                            <span>Workspace</span>
                            <span className="text-[10px] text-slate-500 font-mono">LIVE SYNC</span>
                        </SidebarGroupLabel>

                        <div className="space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const active = isActive(item.href) && item.id !== 'runs' && item.id !== 'integrations' && item.id !== 'templates'
                                return (
                                    <SidebarMenuButton
                                        key={item.name}
                                        onClick={() => handleNavClick(item)}
                                        className={`
                                            group relative h-11 w-full gap-3 rounded-xl px-3 transition-all duration-200 border
                                            ${active
                                                ? 'bg-gradient-to-r from-blue-600/25 to-violet-600/25 border-blue-400/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] font-semibold'
                                                : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/[0.07] hover:border-white/15 hover:text-white shadow-sm'
                                            }
                                        `}
                                    >
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accentGlow} border border-white/10`}>
                                            <item.icon className={`h-4 w-4 ${item.iconColor} transition-transform group-hover:scale-110`} />
                                        </div>

                                        <span className="text-sm flex-1 text-left">{item.name}</span>

                                        {/* Dynamic Live Badges */}
                                        {item.id === 'agents' && (
                                            <span className="shrink-0 rounded-full bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                                                {loadingStats ? '...' : `${activeAgents} active`}
                                            </span>
                                        )}

                                        {item.id === 'runs' && (
                                            <span className="shrink-0 rounded-full bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                                                {loadingStats ? '...' : recentRunsCount > 0 ? `${recentRunsCount} runs` : 'Ready'}
                                            </span>
                                        )}

                                        {item.id === 'integrations' && (
                                            <span className="shrink-0 rounded-full bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                                                9 tools
                                            </span>
                                        )}

                                        {item.id === 'templates' && (
                                            <span className="shrink-0 rounded-full bg-rose-500/20 border border-rose-400/30 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                                                4 ready
                                            </span>
                                        )}
                                    </SidebarMenuButton>
                                )
                            })}
                        </div>
                    </SidebarGroup>

                    {/* Account & Platform Section */}
                    <SidebarGroup className="p-0 pt-2 border-t border-white/10">
                        <SidebarGroupLabel className="text-[11px] font-bold text-slate-400/80 uppercase tracking-wider px-3 mb-2">
                            Platform
                        </SidebarGroupLabel>

                        <div className="space-y-1">
                            <SidebarMenuButton
                                onClick={() => setActiveModal('settings')}
                                className="group h-10 w-full gap-3 rounded-xl px-3 border border-transparent text-slate-400 hover:bg-white/[0.05] hover:border-white/10 hover:text-white transition-all"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 group-hover:text-blue-400">
                                    <Settings className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-xs font-medium">Settings & API</span>
                            </SidebarMenuButton>

                            <SidebarMenuButton
                                onClick={() => setActiveModal('runs')}
                                className="group h-10 w-full gap-3 rounded-xl px-3 border border-transparent text-slate-400 hover:bg-white/[0.05] hover:border-white/10 hover:text-white transition-all"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 group-hover:text-emerald-400">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-xs font-medium">Execution Activity</span>
                            </SidebarMenuButton>
                        </div>
                    </SidebarGroup>
                </SidebarContent>

                {/* Sidebar Footer with Live Real-time Quota & Clerk Auth */}
                <SidebarFooter className="p-4 flex flex-col gap-3 border-t border-white/10 bg-white/[0.03]">
                    {/* Live Agent Capacity Progress Bar */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 shadow-inner">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                                <Zap className="h-3.5 w-3.5 text-amber-400" />
                                <span className="text-xs font-semibold text-slate-300">Active Agents</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 font-mono">
                                {loadingStats ? '-' : `${activeAgents} / ${maxQuota}`}
                            </span>
                        </div>

                        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                style={{ width: `${Math.max(8, utilizationPct)}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
                            <span>Concurrency load</span>
                            <span className="font-bold text-white">{utilizationPct}% utilized</span>
                        </div>
                    </div>

                    {/* Real-time Clerk User Profile */}
                    <div className="flex items-center justify-between px-1.5 pt-1">
                        <div className="flex items-center gap-3 min-w-0">
                            {user?.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt={user.fullName ?? 'User'}
                                    width={34}
                                    height={34}
                                    className="rounded-full object-cover border border-white/20 shadow-sm shrink-0"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white border border-white/20 shrink-0">
                                    {user?.firstName?.[0] ?? user?.fullName?.[0] ?? 'A'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                    {isLoaded ? (user?.fullName || user?.firstName || 'Logged In User') : 'Loading...'}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                    {isLoaded ? (user?.primaryEmailAddress?.emailAddress || 'Connected') : '...'}
                                </p>
                            </div>
                        </div>

                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: 'h-7 w-7 ring-2 ring-blue-500/40 hover:ring-blue-400 transition-all',
                                    userButtonPopoverCard: 'bg-[#0d0c24] border border-white/15 text-white shadow-2xl backdrop-blur-xl',
                                    userButtonPopoverActionButtonText: 'text-slate-200 hover:text-white',
                                    userButtonPopoverFooter: 'hidden'
                                }
                            }}
                        />
                    </div>
                </SidebarFooter>
            </Sidebar>

            {/* ============================================================== */}
            {/* Functional Modals: Integrations, Templates, Runs, Settings     */}
            {/* ============================================================== */}

            {/* Integrations Modal */}
            {activeModal === 'integrations' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0b0a24]/95 p-6 shadow-2xl text-white">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <Blocks className="h-5 w-5 text-purple-400" />
                                <div>
                                    <h3 className="text-lg font-bold">Connected Integrations</h3>
                                    <p className="text-xs text-slate-400">Available execution tools configured for your AI agents</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                            {INTEGRATIONS_LIST.map((tool) => (
                                <div
                                    key={tool.name}
                                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.04] hover:border-purple-400/40 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{tool.icon}</span>
                                        <div>
                                            <p className="text-xs font-bold text-white">{tool.name}</p>
                                            <p className="text-[10px] text-slate-400">{tool.category}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tool.connected
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                        : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                                    }`}>
                                        {tool.connected ? 'Active' : 'Standby'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                className="rounded-full bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Templates Modal */}
            {activeModal === 'templates' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0b0a24]/95 p-6 shadow-2xl text-white">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <Sparkles className="h-5 w-5 text-rose-400" />
                                <div>
                                    <h3 className="text-lg font-bold">Agent Templates Gallery</h3>
                                    <p className="text-xs text-slate-400">Launch a production-ready agent in 1 click</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                            {TEMPLATES_LIST.map((tpl) => (
                                <div
                                    key={tpl.title}
                                    className="p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:border-rose-400/40 hover:bg-white/[0.07] transition-all flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{tpl.title}</h4>
                                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tpl.desc}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {tpl.tools.map((t) => (
                                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveModal(null)
                                            router.push('/dashboard/agents')
                                        }}
                                        className="shrink-0 rounded-full bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors shadow-md"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Runs & Execution Modal */}
            {activeModal === 'runs' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0a24]/95 p-6 shadow-2xl text-white">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <Clock className="h-5 w-5 text-amber-400" />
                                <div>
                                    <h3 className="text-lg font-bold">Execution Activity & Runs</h3>
                                    <p className="text-xs text-slate-400">Real-time telemetry of background jobs</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white">All Scheduled Jobs Operational</p>
                                        <p className="text-[10px] text-emerald-300">Next trigger: Today at 09:00 AM IST</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-emerald-400 font-bold">100% SUCCESS</span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pt-2">
                                You currently have <span className="text-white font-bold">{totalAgents} configured agents</span>. To trigger on-demand runs or inspect individual output logs, visit the My Agents workspace.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveModal(null)
                                    router.push('/dashboard/agents')
                                }}
                                className="rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition-colors"
                            >
                                Open Agents Workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings & API Modal */}
            {activeModal === 'settings' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0a24]/95 p-6 shadow-2xl text-white">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="h-5 w-5 text-blue-400" />
                                <div>
                                    <h3 className="text-lg font-bold">Workspace Configuration</h3>
                                    <p className="text-xs text-slate-400">Environment and model provider credentials</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                                <p className="text-xs font-semibold text-slate-300">Active AI Model</p>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white font-mono">Gemini 3.5 / 3.8 Flash (Multi-Tier)</span>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">CONNECTED</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl border border-white/10 bg-white/[0.04]">
                                <p className="text-xs font-semibold text-slate-300">Database Engine</p>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white font-mono">Neon Serverless PostgreSQL</span>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                className="rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
