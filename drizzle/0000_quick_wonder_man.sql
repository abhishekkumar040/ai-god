CREATE TABLE "agent_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"agent_name" text NOT NULL,
	"instructions" text,
	"objectives" jsonb,
	"schedule_interval" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_run" (
	"id" serial PRIMARY KEY NOT NULL,
	"agent_config_id" integer,
	"status" text NOT NULL,
	"output" jsonb,
	"logs" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"instruction" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"output" jsonb,
	"schedule_interval" text,
	"next_run" timestamp,
	"run_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_task_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer,
	"status" text NOT NULL,
	"result" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image_url" text,
	"agent_credits" integer DEFAULT 100,
	"usage_credits" integer DEFAULT 50,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_agent_config_id_agent_config_id_fk" FOREIGN KEY ("agent_config_id") REFERENCES "public"."agent_config"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_task_runs" ADD CONSTRAINT "agent_task_runs_task_id_agent_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."agent_task"("id") ON DELETE no action ON UPDATE no action;