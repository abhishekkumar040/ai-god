import { db } from "../db";
import { tools } from "../db/schema";

const seed = [
  {
    slug: "serpapi",
    name: "SerpAPI Web Search",
    description: "Search Google and return structured results such as jobs, news and web pages.",
    category: "search",
    provider: "serpapi",
  },
  {
    slug: "web-scraper",
    name: "Web Scraper",
    description: "Fetch and extract readable content from a web page URL.",
    category: "search",
    provider: "internal",
  },
  {
    slug: "reddit",
    name: "Reddit",
    description: "Read trending posts and discussions from subreddits.",
    category: "social",
    provider: "reddit",
  },
  {
    slug: "gmail",
    name: "Gmail",
    description: "Read and summarize emails from the connected inbox.",
    category: "email",
    provider: "google",
    requiresAuth: true,
    authType: "oauth",
    authProvider: "google",
  },
  {
    slug: "google-calendar",
    name: "Google Calendar",
    description: "Read calendar events to plan the day.",
    category: "productivity",
    provider: "google",
    requiresAuth: true,
    authType: "oauth",
    authProvider: "google",
  },
  {
    slug: "slack",
    name: "Slack",
    description: "Send messages and summaries to a Slack channel.",
    category: "messaging",
    provider: "slack",
    requiresAuth: true,
    authType: "oauth",
    authProvider: "slack",
    canWrite: true,
  },
];

async function main() {
  await db.insert(tools).values(seed).onConflictDoNothing({ target: tools.slug });
  console.log(`Seeded ${seed.length} tools`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
