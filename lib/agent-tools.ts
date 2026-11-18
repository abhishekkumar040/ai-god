type RedditPost = {
  subreddit: string;
  title: string;
  author: string;
  upvotes: number;
  comments: number;
  url: string;
};

const DEFAULT_SUBREDDITS = ["artificial", "MachineLearning", "singularity", "OpenAI", "LocalLLaMA"];

async function fetchReddit(): Promise<RedditPost[]> {
  const lists = await Promise.all(
    DEFAULT_SUBREDDITS.map(async (sub) => {
      try {
        const res = await fetch(`https://www.reddit.com/r/${sub}/top.json?t=day&limit=10`, {
          headers: { "User-Agent": "ai-god-agent/1.0" },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data.children.map((c: any) => ({
          subreddit: c.data.subreddit,
          title: c.data.title,
          author: c.data.author,
          upvotes: c.data.ups,
          comments: c.data.num_comments,
          url: `https://reddit.com${c.data.permalink}`,
        })) as RedditPost[];
      } catch {
        return [];
      }
    })
  );
  return lists.flat();
}

// Runs every tool the agent has and returns the data keyed by tool slug
export async function runTools(slugs: string[]) {
  const data: Record<string, unknown> = {};
  for (const slug of slugs) {
    if (slug === "reddit") data[slug] = await fetchReddit();
    else data[slug] = `Tool "${slug}" is not implemented yet.`;
  }
  return data;
}
