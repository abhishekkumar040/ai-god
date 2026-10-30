import { integer, pgTable, serial, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

// Users table for handling identity, credits, and profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(), // Clerk / Inforge Auth ID
  name: text("name"),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  agentCredits: integer("agent_credits").default(100),
  usageCredits: integer("usage_credits").default(50),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tools table for managing application plugins and capabilities
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  provider: text("provider").notNull(),
  icon: text("icon"),
  requiresAuth: boolean("requires_auth").default(false).notNull(),
  authType: text("auth_type"),
  authProvider: text("auth_provider"),
  capabilities: jsonb("capabilities"),
  useCases: jsonb("use_cases"),
  approvalRules: jsonb("approval_rules"),
  config: jsonb("config"),
  riskLevel: text("risk_level").default("low").notNull(),
  canRead: boolean("can_read").default(true).notNull(),
  canWrite: boolean("can_write").default(false).notNull(),
  canDelete: boolean("can_delete").default(false).notNull(),
  canExecute: boolean("can_execute").default(false).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent Configurations table for storing agent behaviors and schedules
export const agentConfig = pgTable("agent_config", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  agentName: text("agent_name").notNull(),
  agentImage: text("agent_image"), // avatar URL (DiceBear)
  description: text("description"),
  objective: text("objective"),
  instructions: text("instructions"),
  objectives: jsonb("objectives"),
  tools: jsonb("tools").$type<string[]>().default([]).notNull(),
  skills: jsonb("skills").$type<string[]>().default([]).notNull(),
  scheduleType: text("schedule_type", { enum: ["on_demand", "recurring"] })
    .default("on_demand")
    .notNull(),
  scheduleFrequency: text("schedule_frequency").default("none").notNull(),
  scheduleTime: text("schedule_time").default("").notNull(),
  scheduleInterval: text("schedule_interval"),
  outputFormat: text("output_format"),
  status: text("status", { enum: ["active", "paused", "draft", "archived"] })
    .default("active")
    .notNull(), // current state of the agent
  isActive: boolean("is_active").default(true).notNull(), // legacy, remove once unused
  lastRunAt: timestamp("last_run_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Agent Runs table for tracking execution status, logs, and outputs
export const agentRun = pgTable("agent_run", {
  id: serial("id").primaryKey(),
  agentConfigId: integer("agent_config_id").references(() => agentConfig.id),
  status: text("status").notNull(), // running, completed, failed
  output: jsonb("output"),
  logs: text("logs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent Tasks table for managing background queue tasks and repeating schedules
export const agentTask = pgTable("agent_task", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  instruction: text("instruction").notNull(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed, cancelled
  output: jsonb("output"),
  scheduleInterval: text("schedule_interval"),
  nextRun: timestamp("next_run"),
  runCount: integer("run_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent Task Runs for logging individual execution histories of tasks
export const agentTaskRuns = pgTable("agent_task_runs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => agentTask.id),
  status: text("status").notNull(),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TypeScript type exports for all tables
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;

export type AgentConfig = typeof agentConfig.$inferSelect;
export type NewAgentConfig = typeof agentConfig.$inferInsert;

export type AgentRun = typeof agentRun.$inferSelect;
export type NewAgentRun = typeof agentRun.$inferInsert;

export type AgentTask = typeof agentTask.$inferSelect;
export type NewAgentTask = typeof agentTask.$inferInsert;

export type AgentTaskRun = typeof agentTaskRuns.$inferSelect;
export type NewAgentTaskRun = typeof agentTaskRuns.$inferInsert;