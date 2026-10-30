"use client"
import React, { useEffect, useRef, useState } from 'react'
import {
  Plus,
  ArrowUp,
  Briefcase,
  Mail,
  Search,
  Loader2,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react'
import axios from 'axios'
import type {
  AgentConfig,
  AgentConfigResponse,
  ClarificationQuestion,
} from '@/data/responseschema'

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */

const quickSuggestions = [
  { label: "Find AI Jobs", prompt: "Find AI developer jobs matching my skills." },
  { label: "Inbox Summary", prompt: "Summarize my unread emails from the last 24 hours." },
  { label: "Research Topic", prompt: "Research the latest trends in AI and web development." },
  { label: "Plan My Day", prompt: "Check my calendar and create a prioritized daily plan." },
  { label: "Reddit Trends", prompt: "Find top trending AI related topics on Reddit." },
]

const templates = [
  {
    title: "Find latest jobs",
    description: "Search the web for the latest jobs matching my profile.",
    icon: Briefcase,
    iconBg: "bg-orange-100 group-hover:bg-orange-600 transition-colors duration-300",
    iconColor: "text-orange-600 group-hover:text-white transition-colors duration-300",
  },
  {
    title: "Daily inbox summary",
    description: "Summarize important emails and highlight what needs my attention.",
    icon: Mail,
    iconBg: "bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300",
    iconColor: "text-blue-600 group-hover:text-white transition-colors duration-300",
  },
  {
    title: "Research a topic",
    description: "Search the web and create a useful research summary for me.",
    icon: Search,
    iconBg: "bg-sky-100 group-hover:bg-sky-600 transition-colors duration-300",
    iconColor: "text-sky-600 group-hover:text-white transition-colors duration-300",
  },
]

const STEPS = ['Describe', 'Clarify', 'Review'] as const

/* ------------------------------------------------------------------ */
/* Types & helpers                                                     */
/* ------------------------------------------------------------------ */

type Step = 'prompt' | 'clarify' | 'review'

type SavedAnswer = { id: string; question: string; answer: string }

// Draft value for a question: single/text -> string, multi -> string[]
type Draft = { selected: string | string[]; custom: string }

type CreateAgentProps = {
  /** Called when the user confirms the generated config. */
  onCreate?: (config: AgentConfig) => void | Promise<void>
}

function emptyDraft(q: ClarificationQuestion): Draft {
  return { selected: q.type === 'multi_select' ? [] : '', custom: '' }
}

/** Convert a draft into the final answer string ('' if unanswered). */
function draftToAnswer(q: ClarificationQuestion, d: Draft | undefined): string {
  if (!d) return ''
  const custom = d.custom.trim()

  if (q.type === 'text') {
    return custom || (typeof d.selected === 'string' ? d.selected.trim() : '')
  }

  if (q.type === 'multi_select') {
    const picked = Array.isArray(d.selected) ? d.selected : []
    return [...picked, ...(custom ? [custom] : [])].join(', ')
  }

  // single_select: a typed custom value wins over a chip
  return custom || (typeof d.selected === 'string' ? d.selected : '')
}

function getErrorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return e.response?.data?.error ?? 'Request failed. Please try again.'
  }
  return 'Something went wrong. Please try again.'
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

function CreateAgent({ onCreate }: CreateAgentProps) {
  const [prompt, setPrompt] = useState('')
  const [step, setStep] = useState<Step>('prompt')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Original request, kept fixed across clarification rounds
  const [basePrompt, setBasePrompt] = useState('')
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([])
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([])
  const [configResult, setConfigResult] = useState<AgentConfigResponse | null>(null)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  const resultRef = useRef<HTMLDivElement>(null)
  const config = configResult?.status === 'ready' ? configResult.config : null

  // Bring the new section into view whenever the step changes
  useEffect(() => {
    if (step !== 'prompt') {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  /* ---------------------------- API ---------------------------- */

  const callApi = async (promptText: string, answers: SavedAnswer[]) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post<AgentConfigResponse>('/api/agent/configure', {
        prompt: promptText,
        answers: answers.map(({ question, answer }) => ({ question, answer })),
      })
      console.log(data)

      if (data.status === 'needs_clarification' && data.clarificationQuestions?.length) {
        setQuestions(data.clarificationQuestions)
        setDrafts(
          Object.fromEntries(data.clarificationQuestions.map((q) => [q.id, emptyDraft(q)]))
        )
        setConfigResult(null)
        setStep('clarify')
      } else if (data.status === 'ready' && data.config) {
        setConfigResult(data)
        setStep('review')
      } else {
        setError('The AI returned an unexpected response. Please try again.')
      }
    } catch (e) {
      console.error(e)
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const OnSubmit = async () => {
    if (!prompt.trim() || loading) return
    const text = prompt.trim()
    setBasePrompt(text)
    setSavedAnswers([])
    setConfigResult(null)
    setCreated(false)
    await callApi(text, [])
  }

  const onSubmitAnswers = async () => {
    if (loading) return
    const newAnswers: SavedAnswer[] = questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: draftToAnswer(q, drafts[q.id]),
    }))
    // Keep earlier rounds so the model never re-asks them
    const all = [...savedAnswers, ...newAnswers]
    setSavedAnswers(all)
    await callApi(basePrompt, all)
  }

  const onConfirmCreate = async () => {
    if (!config || creating) return
    setCreating(true)
    setError(null)
    try {
      await onCreate?.(config)
      setCreated(true)
    } catch (e) {
      console.error(e)
      setError('Could not create the agent. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const startOver = () => {
    setStep('prompt')
    setQuestions([])
    setDrafts({})
    setSavedAnswers([])
    setConfigResult(null)
    setCreated(false)
    setError(null)
  }

  /* ------------------------ Draft updaters ------------------------ */

  const setSingle = (q: ClarificationQuestion, value: string) =>
    setDrafts((prev) => ({
      ...prev,
      // choosing a chip clears the custom text so only one value applies
      [q.id]: { selected: value, custom: '' },
    }))

  const toggleMulti = (q: ClarificationQuestion, value: string) =>
    setDrafts((prev) => {
      const current = prev[q.id] ?? emptyDraft(q)
      const list = Array.isArray(current.selected) ? current.selected : []
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...prev, [q.id]: { ...current, selected: next } }
    })

  const setCustom = (q: ClarificationQuestion, value: string) =>
    setDrafts((prev) => {
      const current = prev[q.id] ?? emptyDraft(q)
      return {
        ...prev,
        [q.id]: {
          // typing a custom value deselects a single-select chip
          selected: q.type === 'single_select' ? '' : current.selected,
          custom: value,
        },
      }
    })

  const allAnswered = questions.every((q) => draftToAnswer(q, drafts[q.id]).length > 0)
  const activeIndex = step === 'prompt' ? 0 : step === 'clarify' ? 1 : 2
  const promptLocked = step !== 'prompt' || loading

  /* ---------------------------- Render ---------------------------- */

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create New Agent</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ask what type of agent you want to create, Type your goal, task, or workflow
        </p>
      </div>

      {/* Progress steps */}
      <ol className="mt-5 flex items-center gap-2 text-xs font-medium">
        {STEPS.map((label, i) => {
          const done = i < activeIndex
          const active = i === activeIndex
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] transition-colors ${done
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : active
                    ? 'border-blue-600 text-blue-600'
                    : 'border-slate-300 text-slate-400'
                  }`}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={active ? 'text-slate-900' : done ? 'text-slate-700' : 'text-slate-400'}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px w-8 bg-slate-200" />}
            </li>
          )
        })}
      </ol>

      {/* Prompt Box */}
      <div className='w-full border rounded-2xl bg-background p-3 shadow-lg shadow-blue-100/50 hover:shadow-blue-200 mt-5 flex flex-col justify-between transition-all'>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              OnSubmit()
            }
          }}
          readOnly={promptLocked}
          placeholder="Describe the agent you want to create..."
          className={`min-h-[120px] w-full resize-none bg-transparent p-2 text-sm outline-none placeholder:text-muted-foreground ${promptLocked ? 'opacity-70' : ''
            }`}
        />
        <div className='flex justify-between items-center mt-2'>
          {step === 'prompt' ? (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md h-9 w-9 text-muted-foreground hover:bg-slate-100 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startOver}
              disabled={loading || creating}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-blue-700 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              New request
            </button>
          )}
          <button
            type="button"
            onClick={OnSubmit}
            disabled={loading || !prompt.trim() || step !== 'prompt'}
            aria-label="Generate agent"
            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Loading card */}
      {loading && (
        <div className="mt-6 flex w-fit items-center gap-3 rounded-2xl border bg-background p-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-slate-900">
            {step === 'clarify' ? 'Updating agent config...' : 'Generating agent config...'}
          </span>
        </div>
      )}

      {/* ========================= STEP: PROMPT ========================= */}
      {step === 'prompt' && (
        <>
          {/* Quick Suggestions Pills */}
          <div className='flex flex-wrap gap-2 mt-4'>
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(suggestion.prompt)}
                className="text-xs font-medium border rounded-full px-4 py-2 bg-background hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
              >
                {suggestion.label}
              </button>
            ))}
          </div>

          {/* Get Started Section */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Get Started</h3>
              <span className="text-sm font-medium text-slate-900 cursor-pointer hover:underline">
                View All
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template, index) => {
                const IconComponent = template.icon
                return (
                  <div
                    key={index}
                    onClick={() => setPrompt(template.description)}
                    className="group border rounded-2xl p-5 bg-background cursor-pointer hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${template.iconBg} mb-6`}
                      >
                        <IconComponent className={`h-6 w-6 ${template.iconColor}`} />
                      </div>
                      <h4 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors duration-200">
                        {template.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ======================== STEP: CLARIFY ======================== */}
      {step === 'clarify' && !loading && (
        <div
          ref={resultRef}
          className="mt-6 scroll-mt-6 rounded-2xl border bg-background p-5 shadow-lg shadow-blue-100/50"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">A few quick questions</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Answer these so your agent is set up exactly how you want it.
          </p>

          <div className="mt-5 flex flex-col gap-6">
            {questions.map((q, i) => {
              const draft = drafts[q.id] ?? emptyDraft(q)
              const selectedList = Array.isArray(draft.selected) ? draft.selected : []
              const isSelect = q.type === 'single_select' || q.type === 'multi_select'

              return (
                <div key={q.id}>
                  <p className="text-sm font-semibold text-slate-900">
                    {i + 1}. {q.question}
                  </p>
                  {q.type === 'multi_select' && (
                    <p className="mt-0.5 text-xs text-muted-foreground">Select all that apply</p>
                  )}

                  {isSelect && q.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const active =
                          q.type === 'multi_select'
                            ? selectedList.includes(opt)
                            : draft.selected === opt
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              q.type === 'multi_select' ? toggleMulti(q, opt) : setSingle(q, opt)
                            }
                            className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-full px-4 py-2 transition-all shadow-sm ${active
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-background hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                              }`}
                          >
                            {active && <Check className="h-3 w-3" />}
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {(q.type === 'text' || q.allowCustom) && (
                    <input
                      type="text"
                      value={draft.custom}
                      onChange={(e) => setCustom(q, e.target.value)}
                      placeholder={q.type === 'text' ? 'Type your answer...' : 'Or type your own...'}
                      className="mt-3 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onSubmitAnswers}
              disabled={!allAnswered || loading}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ========================= STEP: REVIEW ========================= */}
      {step === 'review' && config && !loading && (
        <div
          ref={resultRef}
          className="mt-6 scroll-mt-6 rounded-2xl border bg-background p-5 shadow-lg shadow-blue-100/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{config.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {created ? 'Created' : 'Ready'}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Objective">{config.objective}</Field>
            <Field label="Output format">{config.outputFormat}</Field>

            <Field label="Schedule">
              {config.schedule.type === 'on_demand'
                ? 'On demand (runs when you trigger it)'
                : `${config.schedule.frequency}${config.schedule.time ? ` at ${config.schedule.time}` : ''}`}
            </Field>

            <Field label="Tools">
              <div className="flex flex-wrap gap-2">
                {config.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Field>

            {config.skills.length > 0 && (
              <div className="md:col-span-2">
                <Field label="Skills">
                  <div className="flex flex-wrap gap-2">
                    {config.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            <div className="md:col-span-2">
              <Field label="Instructions">
                <p className="whitespace-pre-wrap leading-relaxed">{config.instructions}</p>
              </Field>
            </div>
          </div>

          {/* Raw JSON, collapsed by default */}
          <details className="mt-5">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-blue-700">
              View raw JSON
            </summary>
            <pre className="mt-2 max-h-96 overflow-auto rounded-xl border bg-slate-50 p-4 text-xs text-slate-800">
              {JSON.stringify(configResult, null, 2)}
            </pre>
          </details>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={startOver}
              disabled={creating}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-slate-900 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Start over
            </button>
            <button
              type="button"
              onClick={onConfirmCreate}
              disabled={creating || created}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              {created ? 'Agent created' : 'Create Agent'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Small presentational helper                                         */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 text-sm text-slate-900">{children}</div>
    </div>
  )
}

export default CreateAgent