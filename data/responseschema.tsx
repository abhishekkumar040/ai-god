import { Type } from "@google/genai";

/**
 * Default tool slugs. Used only as a fallback for the static schema.
 * At runtime the route builds the schema from the database with
 * buildAgentConfigRespSchema(slugs), so new tools need no edit here.
 */
export const TOOL_SLUGS = [
    "serpapi",
    "browserbase",
    "gmail",
    "outlook",
    "slack",
    "discord",
    "google-calendar",
    "github",
    "reddit",
] as const;

export const AgentConfigRespSchema = {
    type: Type.OBJECT,
    description:
        "Either a set of clarification questions or a complete agent configuration.",
    properties: {
        status: {
            type: Type.STRING,
            enum: ["needs_clarification", "ready"],
            description:
                "'needs_clarification' when blocking details are missing, 'ready' when the config is complete.",
        },

        clarificationQuestions: {
            type: Type.ARRAY,
            description:
                "Up to 3 questions when status is 'needs_clarification'. Empty array when status is 'ready'.",
            maxItems: "3",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Unique id such as q1, q2, q3." },
                    question: {
                        type: Type.STRING,
                        description: "Short question answerable in one tap or one short phrase.",
                    },
                    type: {
                        type: Type.STRING,
                        enum: ["text", "single_select", "multi_select"],
                        description:
                            "single_select for one choice, multi_select for several, text for free-form answers.",
                    },
                    options: {
                        type: Type.ARRAY,
                        description:
                            "2-4 practical suggestions for select types. Empty array for text questions.",
                        items: { type: Type.STRING },
                    },
                    allowCustom: {
                        type: Type.BOOLEAN,
                        description:
                            "True when the user may type their own value (channels, emails, keywords).",
                    },
                },
                required: ["id", "question", "type", "options", "allowCustom"],
                propertyOrdering: ["id", "question", "type", "options", "allowCustom"],
            },
        },

        config: {
            type: Type.OBJECT,
            description:
                "The final agent configuration. Only present when status is 'ready'.",
            properties: {
                name: {
                    type: Type.STRING,
                    description: "Specific title of 3-6 words in Title Case.",
                },
                description: {
                    type: Type.STRING,
                    description: "One or two plain-language sentences explaining what the agent does.",
                },
                objective: {
                    type: Type.STRING,
                    description: "One clear sentence stating the goal and what success looks like.",
                },
                instructions: {
                    type: Type.STRING,
                    description:
                        "Detailed step-by-step imperative instructions, including tools by slug, filters, delivery target, and the fallback when nothing is found.",
                },
                tools: {
                    type: Type.ARRAY,
                    description: "Unique tool slugs the agent needs, including the delivery tool.",
                    items: {
                        type: Type.STRING,
                        enum: [...TOOL_SLUGS] as string[],
                    },
                },
                skills: {
                    type: Type.ARRAY,
                    description:
                        "Short lowercase capability labels such as web-research, data-extraction, summarization. Not tool slugs. Empty array if none.",
                    items: { type: Type.STRING },
                },
                schedule: {
                    type: Type.OBJECT,
                    description: "When the agent runs.",
                    properties: {
                        type: {
                            type: Type.STRING,
                            enum: ["on_demand", "recurring"],
                            description: "'on_demand' runs only when triggered; 'recurring' runs on a schedule.",
                        },
                        frequency: {
                            type: Type.STRING,
                            description:
                                "For recurring: hourly, daily, weekly, or monthly (name the day for weekly/monthly, e.g. 'weekly on Monday'). For on_demand: 'none'.",
                        },
                        time: {
                            type: Type.STRING,
                            description:
                                "24-hour HH:mm (e.g. '07:00'), optionally followed by a timezone (e.g. '09:00 IST'). Empty string for on_demand and hourly.",
                        },
                    },
                    required: ["type", "frequency", "time"],
                    propertyOrdering: ["type", "frequency", "time"],
                },
                outputFormat: {
                    type: Type.STRING,
                    description:
                        "What the agent delivers and how it is structured, e.g. 'Markdown list with title, company, location, and apply link'.",
                },
            },
            required: [
                "name",
                "description",
                "objective",
                "instructions",
                "tools",
                "skills",
                "schedule",
                "outputFormat",
            ],
            propertyOrdering: [
                "name",
                "description",
                "objective",
                "instructions",
                "tools",
                "skills",
                "schedule",
                "outputFormat",
            ],
        },
    },
    // config is intentionally NOT required: it is omitted when status is "needs_clarification".
    required: ["status", "clarificationQuestions"],
    propertyOrdering: ["status", "clarificationQuestions", "config"],
};

/**
 * Returns a copy of the schema whose tools enum matches the given slugs
 * (for example the slugs loaded from the database).
 */
export function buildAgentConfigRespSchema(slugs: string[]) {
    const schema = structuredClone(AgentConfigRespSchema);
    type ToolsItems = {
        properties: { config: { properties: { tools: { items: { enum: string[] } } } } };
    };
    (schema as unknown as ToolsItems).properties.config.properties.tools.items.enum = [
        ...new Set(slugs),
    ];
    return schema;
}

/* ---------- Types matching the schema ---------- */

export type ClarificationQuestion = {
    id: string;
    question: string;
    type: "text" | "single_select" | "multi_select";
    options: string[];
    allowCustom: boolean;
};

export type AgentConfig = {
    name: string;
    description: string;
    objective: string;
    instructions: string;
    /** Tool slugs from the database. */
    tools: string[];
    skills: string[];
    schedule: {
        type: "on_demand" | "recurring";
        frequency: string;
        time: string;
    };
    outputFormat: string;
};

export type AgentConfigResponse =
    | { status: "needs_clarification"; clarificationQuestions: ClarificationQuestion[]; config?: undefined }
    | { status: "ready"; clarificationQuestions: []; config: AgentConfig };