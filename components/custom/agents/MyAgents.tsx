"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
    CalendarClock,
    Pencil,
    MoreHorizontal,
    Pause,
    Play,
    Trash2,
    Loader2,
    Plus,
    X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AgentRow = {
    id: number
    agentName: string
    description: string | null
    objective: string | null
    instructions: string | null
    tools: string[]
    skills: string[]
    scheduleType: 'on_demand' | 'recurring'
    scheduleFrequency: string
    scheduleTime: string
    outputFormat: string | null
    isActive: boolean
    lastRunAt: string | null
    createdAt: string
}

type MyAgentsProps = {
    /** Change this number to make the list reload (e.g. after creating an agent). */
    refreshKey?: number
    onCreateClick?: () => void
}

/* ------------------------------------------------------------------ */
/* Schedule helpers                                                    */
/* ------------------------------------------------------------------ */

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function parseTime(time: string): { h: number; min: number } | null {
    const m = time.match(/(\d{1,2}):(\d{2})/)
    if (!m) return null
    return { h: Number(m[1]), min: Number(m[2]) }
}

function format12h({ h, min }: { h: number; min: number }): string {
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(min).padStart(2, '0')} ${suffix}`
}

function capitalize(s: string): string {
    return s ? s[0].toUpperCase() + s.slice(1) : s
}

/** "Next run today at 9:00 AM", "Next run Monday at 9:00 AM", ... */
function nextRunLabel(a: AgentRow): string {
    if (!a.isActive) return 'Paused'
    if (a.scheduleType === 'on_demand') return 'Runs on demand'

    const freq = a.scheduleFrequency.toLowerCase()
    if (freq.includes('hour')) return 'Next run within the hour'

    const parsed = parseTime(a.scheduleTime)
    if (!parsed) return 'Scheduled'
    const timeLabel = format12h(parsed)

    const now = new Date()
    const today = new Date()
    today.setHours(parsed.h, parsed.min, 0, 0)
    const laterToday = today.getTime() > now.getTime()

    if (freq.includes('week')) {
        const dayIndex = DAYS.findIndex((d) => freq.includes(d))
        if (dayIndex === -1) return `Next run weekly at ${timeLabel}`
        if (dayIndex === now.getDay() && laterToday) return `Next run today at ${timeLabel}`
        return `Next run ${capitalize(DAYS[dayIndex])} at ${timeLabel}`
    }

    if (freq.includes('month')) return `Next run monthly at ${timeLabel}`

    // daily (default)
    return `Next run ${laterToday ? 'today' : 'tomorrow'} at ${timeLabel}`
}

function runsLabel(a: AgentRow): string | null {
    if (a.scheduleType === 'on_demand') return null
    const freq = a.scheduleFrequency.trim().toLowerCase()
    return freq && freq !== 'none' ? `Runs ${freq}` : null
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

const PALETTES = [
    { bg: 'bg-violet-50', face: 'bg-rose-300' },
    { bg: 'bg-sky-50', face: 'bg-amber-300' },
    { bg: 'bg-emerald-50', face: 'bg-pink-300' },
    { bg: 'bg-orange-50', face: 'bg-indigo-300' },
]

function AgentAvatar({ id, active }: { id: number; active: boolean }) {
    const palette = PALETTES[id % PALETTES.length]
    return (
        <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${palette.bg}`}>
            <div className={`flex h-8 w-9 items-center justify-center gap-1.5 rounded-full ${palette.face}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            </div>
            <span
                className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${active ? 'bg-green-500' : 'bg-slate-300'
                    }`}
            />
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Card menu                                                           */
/* ------------------------------------------------------------------ */

function CardMenu({
    agent,
    busy,
    onToggle,
    onDelete,
}: {
    agent: AgentRow
    busy: boolean
    onToggle: () => void
    onDelete: () => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [open])

    return (
        <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                type="button"
                aria-label="More actions"
                onClick={() => setOpen((v) => !v)}
                disabled={busy}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
            </button>

            {open && (
                <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border bg-background py-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false)
                            onToggle()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                        {agent.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {agent.isActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false)
                            onDelete()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Details / edit modal                                                */
/* ------------------------------------------------------------------ */

function AgentModal({
    agent,
    onClose,
    onSaved,
}: {
    agent: AgentRow
    onClose: () => void
    onSaved: (updated: AgentRow) => void
}) {
    const [name, setName] = useState(agent.agentName)
    const [description, setDescription] = useState(agent.description ?? '')
    const [instructions, setInstructions] = useState(agent.instructions ?? '')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const dirty =
        name !== agent.agentName ||
        description !== (agent.description ?? '') ||
        instructions !== (agent.instructions ?? '')

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onClose])

    const save = async () => {
        if (!name.trim() || saving) return
        setSaving(true)
        setError(null)
        try {
            const { data } = await axios.patch<{ agent: AgentRow }>(`/api/agents/${agent.id}`, {
                agentName: name.trim(),
                description: description.trim(),
                instructions: instructions.trim(),
            })
            onSaved(data.agent)
            onClose()
        } catch (e) {
            console.error(e)
            setError(
                axios.isAxiosError(e) ? e.response?.data?.error ?? 'Could not save changes.' : 'Could not save changes.'
            )
        } finally {
            setSaving(false)
        }
    }

    const runs = runsLabel(agent)

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b p-5">
                    <div className="flex items-center gap-3">
                        <AgentAvatar id={agent.id} active={agent.isActive} />
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Edit agent</h3>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarClock className="h-3.5 w-3.5" />
                                {nextRunLabel(agent)}
                                {runs && <span>· {runs}</span>}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="rounded-md p-1 text-muted-foreground hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto p-5">
                    <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1.5 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="mt-1.5 w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Instructions</span>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={7}
                            className="mt-1.5 w-full resize-y rounded-lg border bg-transparent px-3 py-2 text-sm leading-relaxed outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    {agent.tools.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tools</p>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                {agent.tools.map((t) => (
                                    <span key={t} className="rounded-full border bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {agent.outputFormat && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Output format</p>
                            <p className="mt-1.5 text-sm text-slate-900">{agent.outputFormat}</p>
                        </div>
                    )}

                    {error && (
                        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-slate-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={!dirty || !name.trim() || saving}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

function MyAgents({ refreshKey = 0, onCreateClick }: MyAgentsProps) {
    const [agents, setAgents] = useState<AgentRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [busyId, setBusyId] = useState<number | null>(null)
    const [selected, setSelected] = useState<AgentRow | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const { data } = await axios.get<{ agents: AgentRow[] }>('/api/agents')
            setAgents(data.agents ?? [])
        } catch (e) {
            console.error(e)
            setError(
                axios.isAxiosError(e) && e.response?.status === 401
                    ? 'Please sign in to see your agents.'
                    : 'Could not load your agents. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load, refreshKey])

    const toggleActive = async (agent: AgentRow) => {
        setBusyId(agent.id)
        setError(null)
        try {
            await axios.patch(`/api/agents/${agent.id}`, { isActive: !agent.isActive })
            setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, isActive: !a.isActive } : a)))
        } catch (e) {
            console.error(e)
            setError('Could not update the agent. Please try again.')
        } finally {
            setBusyId(null)
        }
    }

    const deleteAgent = async (agent: AgentRow) => {
        if (!window.confirm(`Delete "${agent.agentName}"? This cannot be undone.`)) return
        setBusyId(agent.id)
        setError(null)
        try {
            await axios.delete(`/api/agents/${agent.id}`)
            setAgents((prev) => prev.filter((a) => a.id !== agent.id))
        } catch (e) {
            console.error(e)
            setError('Could not delete the agent. Please try again.')
        } finally {
            setBusyId(null)
        }
    }

    const onSaved = (updated: AgentRow) =>
        setAgents((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)))

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Agents</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
                    </p>
                </div>
                {onCreateClick && (
                    <button
                        type="button"
                        onClick={onCreateClick}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        New agent
                    </button>
                )}
            </div>

            {error && (
                <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-5 flex flex-col gap-3">
                {/* Loading skeletons */}
                {loading &&
                    [0, 1, 2].map((i) => (
                        <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl border bg-background p-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-40 rounded bg-slate-100" />
                                <div className="h-3 w-3/4 rounded bg-slate-100" />
                                <div className="h-3 w-1/3 rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}

                {/* Empty state */}
                {!loading && !error && agents.length === 0 && (
                    <div className="rounded-2xl border border-dashed bg-background p-10 text-center">
                        <p className="text-sm font-semibold text-slate-900">No agents yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Create your first agent and it will show up here.
                        </p>
                        {onCreateClick && (
                            <button
                                type="button"
                                onClick={onCreateClick}
                                className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Create agent
                            </button>
                        )}
                    </div>
                )}

                {/* Agent cards */}
                {!loading &&
                    agents.map((agent) => {
                        const runs = runsLabel(agent)
                        return (
                            <div
                                key={agent.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelected(agent)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setSelected(agent)
                                    }
                                }}
                                className="flex cursor-pointer items-center gap-4 rounded-2xl border bg-background p-4 transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <AgentAvatar id={agent.id} active={agent.isActive} />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="truncate text-sm font-semibold text-slate-900">{agent.agentName}</h3>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${agent.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {agent.isActive ? 'Active' : 'Paused'}
                                        </span>
                                    </div>

                                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                        {agent.description || agent.instructions || 'No description'}
                                    </p>

                                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                                        <CalendarClock className="h-3.5 w-3.5" />
                                        <span>{nextRunLabel(agent)}</span>
                                        {runs && (
                                            <>
                                                <span>·</span>
                                                <span>{runs}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label="Edit agent"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelected(agent)
                                        }}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <CardMenu
                                        agent={agent}
                                        busy={busyId === agent.id}
                                        onToggle={() => toggleActive(agent)}
                                        onDelete={() => deleteAgent(agent)}
                                    />
                                </div>
                            </div>
                        )
                    })}
            </div>

            {selected && (
                <AgentModal
                    key={selected.id}
                    agent={agents.find((a) => a.id === selected.id) ?? selected}
                    onClose={() => setSelected(null)}
                    onSaved={onSaved}
                />
            )}
        </div>
    )
}

export default MyAgents