"use client"
import React, { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import CreateAgent from './CreateAgent'
import MyAgents from './MyAgents'
import type { AgentConfig } from '@/data/responseschema'

type Tab = 'create' | 'my-agents'

const TABS: { id: Tab; label: string }[] = [
    { id: 'create', label: 'Create Agent' },
    { id: 'my-agents', label: 'My Agents' },
]

/**
 * Page-level wrapper: tabs + saving.
 * Render this in app/dashboard/agents/page.tsx in place of your current tab code.
 */
export default function AgentsWorkspace() {
    const [tab, setTab] = useState<Tab>('create')
    const [refreshKey, setRefreshKey] = useState(0)
    const [createKey, setCreateKey] = useState(0)
    const [notice, setNotice] = useState<string | null>(null)

    // Auto-dismiss the success notice
    useEffect(() => {
        if (!notice) return
        const t = setTimeout(() => setNotice(null), 5000)
        return () => clearTimeout(t)
    }, [notice])

    // The agent is already saved by /api/agent/configure when the AI returns "ready".
    // So here we only refresh the list and move to the My Agents tab.
    const handleCreate = async (config: AgentConfig) => {
        setRefreshKey((k) => k + 1) // reload the My Agents list
        setCreateKey((k) => k + 1) // reset the Create Agent form
        setNotice(`"${config.name}" was created and is now active.`)
        setTab('my-agents')
    }

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${tab === t.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-muted-foreground hover:text-slate-900'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Success notice */}
            {notice && (
                <div
                    role="status"
                    className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {notice}
                    </span>
                    <button
                        type="button"
                        aria-label="Dismiss"
                        onClick={() => setNotice(null)}
                        className="text-green-700 hover:text-green-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Both tabs stay mounted so in-progress work is not lost when switching */}
            <div className={`mt-6 ${tab === 'create' ? '' : 'hidden'}`}>
                <CreateAgent key={createKey} onCreate={handleCreate} />
            </div>

            <div className={`mt-6 ${tab === 'my-agents' ? '' : 'hidden'}`}>
                <MyAgents refreshKey={refreshKey} onCreateClick={() => setTab('create')} />
            </div>
        </div>
    )
}