"use client"
import React, { useState } from 'react'
import { Plus, ArrowUp, Briefcase, Mail, Search } from 'lucide-react'

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

function CreateAgent() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create New Agent</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ask what type of agent you want to create, Type your goal, task, or workflow
        </p>
      </div>

      {/* Prompt Box */}
      <div className='w-full border rounded-2xl bg-background p-3 shadow-lg shadow-blue-100/50 hover:shadow-blue-200 mt-5 flex flex-col justify-between transition-all'>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the agent you want to create..."
          className='min-h-[120px] w-full resize-none bg-transparent p-2 text-sm outline-none placeholder:text-muted-foreground'
        />
        <div className='flex justify-between items-center mt-2'>
          <button className="inline-flex items-center justify-center rounded-md h-9 w-9 text-muted-foreground hover:bg-slate-100 transition-colors">
            <Plus className="h-5 w-5" />
          </button>
          <button className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Suggestions Pills */}
      <div className='flex flex-wrap gap-2 mt-4'>
        {quickSuggestions.map((suggestion, index) => (
          <button
            key={index}
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
          <span className="text-sm font-medium text-slate-900 cursor-pointer hover:underline">View All</span>
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${template.iconBg} mb-6`}>
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
    </div>
  )
}

export default CreateAgent