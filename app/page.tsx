import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  CalendarDays,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react'

const display = { className: "" };

/* One glass recipe, used everywhere: frosted fill, hairline light edge, soft depth */
const glass =
  'border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[0_8px_32px_rgba(2,0,30,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]'

const heroAgents = [
  { name: 'Research Scout', desc: 'Finds the latest AI tools and prepares a detailed report.', meta: 'Next run today at 9:00 AM · Runs daily', face: 'bg-rose-300', tile: 'bg-violet-300/25', cls: 'left-0 top-0 rotate-[-3deg]', anim: 'gx-float-a' },
  { name: 'Inbox Digest', desc: 'Summarizes unread email and flags what needs you.', meta: 'Next run today at 8:00 AM · Runs daily', face: 'bg-amber-300', tile: 'bg-sky-300/25', cls: 'right-0 top-[8.5rem] rotate-[2deg]', anim: 'gx-float-b' },
  { name: 'Reddit Trends', desc: 'Posts the top AI topics to your Slack channel.', meta: 'Next run Monday at 9:00 AM · Runs weekly', face: 'bg-indigo-300', tile: 'bg-emerald-300/25', cls: 'left-6 top-[17rem] rotate-[-1.5deg]', anim: 'gx-float-c' },
]

const templates = [
  { title: 'Find the latest jobs', desc: 'Searches job boards every morning and sends you the best matches.', icon: Briefcase, tools: ['Google Search', 'Browserbase', 'Slack'], glow: 'from-orange-400/40' },
  { title: 'Daily inbox summary', desc: 'Reads your unread email and lists what needs your attention.', icon: Mail, tools: ['Gmail', 'Slack'], glow: 'from-sky-400/40' },
  { title: 'Research a topic', desc: 'Searches the web and writes a short research summary for you.', icon: Search, tools: ['Google Search', 'Browserbase'], glow: 'from-blue-400/40' },
  { title: 'Plan my day', desc: 'Checks your calendar and builds a prioritized plan each morning.', icon: CalendarDays, tools: ['Google Calendar', 'Gmail'], glow: 'from-emerald-400/40' },
  { title: 'Track Reddit trends', desc: 'Finds what people are discussing and posts it to your team.', icon: MessageSquare, tools: ['Reddit', 'Discord'], glow: 'from-rose-400/40' },
  { title: 'Watch my repository', desc: 'Summarizes new issues and pull requests on a schedule.', icon: Terminal, tools: ['GitHub', 'Slack'], glow: 'from-violet-400/40' },
]

const steps = [
  { title: 'Describe the task', desc: 'Write what you want in one or two sentences. No setup screens.' },
  { title: 'Answer a few questions', desc: 'The agent asks only about details it cannot guess, like where to send results.' },
  { title: 'Review and switch it on', desc: 'Check the tools, schedule and instructions, then let it run on its own.' },
]

const integrations = ['Google Search', 'Browserbase', 'Gmail', 'Outlook', 'Slack', 'Discord', 'Google Calendar', 'GitHub', 'Reddit']

function Face({ tone }: { tone: string }) {
  return (
    <div className={`flex h-8 w-9 items-center justify-center gap-1.5 rounded-full ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
      <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0b0a24] text-white">
      <style>{`
        @keyframes gx-float-a { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes gx-float-b { 0%,100% { transform: translateY(0) } 50% { transform: translateY(14px) } }
        @keyframes gx-float-c { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        .gx-float-a { animation: gx-float-a 7s ease-in-out infinite }
        .gx-float-b { animation: gx-float-b 8s ease-in-out infinite }
        .gx-float-c { animation: gx-float-c 9s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .gx-float-a, .gx-float-b, .gx-float-c { animation: none } }
      `}</style>

      {/* Backdrop: light sources behind the glass, plus a faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-blue-600/40 blur-[120px]" />
        <div className="absolute right-[-10rem] top-24 h-[32rem] w-[32rem] rounded-full bg-violet-600/45 blur-[130px]" />
        <div className="absolute left-1/3 top-[46rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at 50% 20%, black, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 20%, black, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <header className="sticky top-4 z-30 px-4">
          <nav className={`mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2.5 ${glass}`}>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-7 w-9 items-center">
                <span className="h-7 w-7 rounded-full bg-blue-500" />
                <span className="absolute left-3 h-7 w-7 rounded-full bg-violet-500 mix-blend-screen" />
              </span>
              <span className={`${display.className} text-lg font-bold tracking-tight`}>Groovy AI</span>
            </Link>
            <div className="hidden items-center gap-7 text-sm text-white/70 md:flex">
              <a href="#agents" className="hover:text-white">Agents</a>
              <a href="#templates" className="hover:text-white">Templates</a>
              <a href="#how" className="hover:text-white">How it works</a>
              <a href="#integrations" className="hover:text-white">Integrations</a>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0b0a24] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    userButton: 'bg-transparent hover:bg-white/10 rounded-full border-none px-4 py-2 text-white',
                    dropdownIndicator: 'text-white',
                    popover: 'bg-[#0f0f14] border border-slate-700 rounded-2xl shadow-2xl',
                  },
                }}
              />
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section id="agents" className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <h1 className={`${display.className} text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl`}>
              Tell it what you need.
              <br />
              It gets to work.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Describe a task in plain English. Your agent searches the web, reads your email, posts to Slack and
              runs on the schedule you choose.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/agents"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold shadow-[0_0_40px_-8px_rgba(124,58,237,0.9)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Sparkles className="h-4 w-4" />
                Create your first agent
              </Link>
              <a
                href="#templates"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/15 ${glass}`}
              >
                Browse templates
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-300" />Ready in under a minute</li>
              <li className="flex items-center gap-2"><Workflow className="h-4 w-4 text-sky-300" />9 connected tools</li>
              <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-emerald-300" />Runs on a schedule</li>
            </ul>
          </div>

          {/* The memorable moment: the agents themselves, as floating glass cards */}
          <div className="relative mx-auto h-[26rem] w-full max-w-md" aria-label="Examples of running agents">
            {heroAgents.map((a) => (
              <div key={a.name} className={`absolute w-[92%] ${a.cls}`}>
                <div className={`${a.anim} flex items-center gap-4 rounded-3xl p-4 ${glass}`}>
                  <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${a.tile}`}>
                    <Face tone={a.face} />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#1a1840] bg-green-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">{a.name}</h3>
                      <span className="rounded-full bg-green-400/20 px-2 py-0.5 text-[11px] font-medium text-green-300">Active</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-white/65">{a.desc}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/50">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {a.meta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className={`${display.className} text-4xl font-bold tracking-tight`}>Start from a template</h2>
            <p className="mt-3 text-lg text-white/65">
              Pick a ready-made agent, change anything you like, and switch it on.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => {
              const Icon = t.icon
              return (
                <Link
                  key={t.title}
                  href="/dashboard/agents"
                  className={`group relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${glass}`}
                >
                  <div aria-hidden className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl`} />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-semibold">{t.title}</h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-white/65">{t.desc}</p>
                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {t.tools.map((tool) => (
                      <span key={tool} className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-xs text-white/75">
                        {tool}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* How it works: a real sequence, so numbering carries meaning */}
        <section id="how" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={`${display.className} max-w-2xl text-4xl font-bold tracking-tight`}>
            From one sentence to a working agent
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className={`rounded-3xl p-6 ${glass}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Integrations */}
        <section id="integrations" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={`${display.className} max-w-2xl text-4xl font-bold tracking-tight`}>
            Works with the tools you already use
          </h2>
          <p className="mt-3 max-w-xl text-lg text-white/65">
            Agents search, read, write and post across these apps, so results land where you already work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {integrations.map((name) => (
              <span key={name} className={`rounded-full px-5 py-2.5 text-sm font-medium text-white/85 ${glass}`}>
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* Closing call to action */}
        <section className="mx-auto max-w-5xl px-6 pb-24 pt-10">
          <div className={`relative overflow-hidden rounded-[2rem] px-8 py-14 text-center sm:px-14 ${glass}`}>
            <div aria-hidden className="absolute left-1/2 top-0 h-40 w-3/4 -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
            <h2 className={`${display.className} relative text-4xl font-bold tracking-tight sm:text-5xl`}>
              Your first agent is one sentence away
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-lg text-white/70">
              Sign up, describe what you need, and have it running today.
            </p>
<Link
  href="/dashboard"
  className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0b0a24] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
>
  Create your first agent
</Link>
          </div>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 pb-10 text-sm text-white/45 sm:flex-row">
          <span>Groovy AI</span>
          <div className="flex gap-6">
            <Link href="/sign-in" className="hover:text-white/80">Sign in</Link>
            <Link href="/sign-up" className="hover:text-white/80">Sign up</Link>
            <Link href="/dashboard" className="hover:text-white/80">Dashboard</Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
