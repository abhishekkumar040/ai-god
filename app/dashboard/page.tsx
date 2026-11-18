"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { UserButton } from '@clerk/nextjs'
import {
  CalendarClock,
  Bot,
  Play,
  Settings,
  User,
  TrendingUp,
  TrendingDown,
  Zap,
  FileText,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'

export default function DashboardPage() {
  const { user, isSignedIn } = useUser()
  const [activeAgents, setActiveAgents] = useState(0)
  const [totalAgents, setTotalAgents] = useState(0)
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await axios.get('/api/agents')
      const data = res.data?.agents ?? []
      setAgents(data)
      setTotalAgents(data.length)
      setActiveAgents(data.filter((a: any) => a.isActive).length)
    } catch {
      // silently fail if not authenticated
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn || loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f0f14]/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Groovy AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/50">
              <Search className="h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search agents..."
                className="h-8 bg-transparent border-0 text-sm focus:ring-0 placeholder:text-slate-500"
              />
            </div>
            <UserButton
              mode="popover"
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  popover: 'bg-[#17171d] border border-slate-700 rounded-2xl shadow-2xl',
                  dropdownIndicator: 'text-slate-400',
                  userButton: 'bg-transparent hover:bg-slate-800 rounded-full border-none px-4 py-2',
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="px-6 py-8">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome back, {user?.firstName ?? user?.emailAddress?.[0] ?? 'there'}</h2>
            <p className="mt-1 text-slate-400">
              Here's what's happening with your agents today.
            </p>
          </div>
          <div className="flex items-center gap-3">
<Button size="sm" asChild>
  <Link href="/dashboard/agents">
    <Plus className="h-4 w-4 mr-2" />
    New Agent
  </Link>
</Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <StatCard
            title="Total Agents"
            value={totalAgents}
            trend="+12% from last week"
            trendType="up"
            icon={Bot}
            color="bg-blue-500/10 text-blue-400 border-blue-500/20"
          />
          <StatCard
            title="Active Agents"
            value={activeAgents}
            trend={totalAgents > 0 ? `${Math.round((activeAgents / totalAgents) * 100)}% active` : "0% active"}
            trendType="neutral"
            icon={Play}
            color="bg-green-500/10 text-green-400 border-green-500/20"
          />
          <StatCard
            title="Credits"
            value="1,240"
            trend="-45 today"
            trendType="down"
            icon={Zap}
            color="bg-purple-500/10 text-purple-400 border-purple-500/20"
          />
          <StatCard
            title="Runs Today"
            value="23"
            trend="+8 from yesterday"
            trendType="up"
            icon={FileText}
            color="bg-orange-500/10 text-orange-400 border-orange-500/20"
          />
        </div>

        {/* Tabs: Overview | Agents | Activity */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-900/50 rounded-2xl border border-slate-700">
            <TabsTrigger value="overview" className="flex flex-col items-center justify-center gap-1 px-4 py-3 text-sm font-medium transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-blue-400">
              <TrendingUp className="h-5 w-5" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex flex-col items-center justify-center gap-1 px-4 py-3 text-sm font-medium transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-blue-400">
              <Bot className="h-5 w-5" />
              <span>Agents</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex flex-col items-center justify-center gap-1 px-4 py-3 text-sm font-medium transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-blue-400">
              <CalendarClock className="h-5 w-5" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AgentCard
                name="Research Scout"
                status="active"
                runs="Runs daily at 9:00 AM"
                tools={['Google Search', 'Browserbase', 'Slack']}
                desc="Finds the latest AI tools and prepares a detailed report."
              />
              <AgentCard
                name="Inbox Digest"
                status="paused"
                runs="Paused"
                tools={['Gmail', 'Slack']}
                desc="Summarizes unread email and flags what needs attention."
              />
              <AgentCard
                name="Reddit Trends"
                status="active"
                runs="Runs weekly on Monday"
                tools={['Reddit', 'Discord']}
                desc="Posts top AI topics to your team channel."
              />
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="space-y-3">
              {agents.map((agent: any) => (
                <div key={agent.id} className="group flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{agent.agentName ?? 'Agent'}</h3>
                      <p className="text-xs text-slate-400">{agent.instructions?.slice(0, 60) ?? 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agent.isActive ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                      {agent.isActive ? 'Active' : 'Paused'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-slate-800">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bot className="h-12 w-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-medium text-white">No agents yet</h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Create your first agent to automate tasks, research topics, or manage your workflow.
                  </p>
                  <Button
                    asChild
                    className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2"
                  >
                    <Link href="/dashboard/agents">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Agent
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                <Button variant="outline" size="sm">View all</Button>
              </div>
              <div className="space-y-3">
                {[
                  { action: 'Agent "Research Scout" completed', time: '2 hours ago', status: 'success', icon: CheckCircle2 },
                  { action: 'Agent "Inbox Digest" ran', time: '5 hours ago', status: 'success', icon: CheckCircle2 },
                  { action: 'Agent "Reddit Trends" created', time: '1 day ago', status: 'info', icon: Bot },
                  { action: 'Scheduled run failed', time: '2 days ago', status: 'error', icon: AlertTriangle },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50">
                    <div className={`h-8 w-8 flex items-center justify-center rounded-full ${item.status === 'success' ? 'bg-green-500/10 text-green-400' : item.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend, trendType, icon: Icon, color }: any) {
  return (
    <Card className="border-slate-700 bg-[#17171d]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
        <p className={`mt-1 text-xs ${trendType === 'up' ? 'text-green-400' : trendType === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}

function AgentCard({ name, status, runs, tools, desc }: any) {
  return (
    <Card className="border-slate-700 bg-[#17171d] overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="mt-1 text-xs text-slate-500">{desc}</p>
          </div>
          <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-xs">
            {status === 'active' ? 'Active' : 'Paused'}
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tools.map((t: string) => (
            <span key={t} className="rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-0.5 text-xs text-blue-400">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
          <CalendarClock className="h-3.5 w-3.5" />
          <span>{runs}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
