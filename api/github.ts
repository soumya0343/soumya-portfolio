import type { IncomingMessage, ServerResponse } from "node:http";

const USER = process.env.GITHUB_USER;

const QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
  }
}`;

export default async function handler(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "GITHUB_TOKEN is not configured on the server." }));
    return;
  }

  // Trailing ~371 days so the calendar always has enough leading weeks.
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 371);

  let upstream: Response;
  try {
    upstream = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "user-agent": "soumya-portfolio",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: USER, from: from.toISOString(), to: to.toISOString() },
      }),
    });
  } catch {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "Could not reach GitHub." }));
    return;
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: `GitHub error (${upstream.status}). ${detail.slice(0, 200)}` }));
    return;
  }

  const json = (await upstream.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: { weeks?: { contributionDays?: { date: string; contributionCount: number }[] }[] };
        };
      };
    };
  };

  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  const contributions: { date: string; count: number }[] = [];
  for (const w of weeks) {
    for (const d of w.contributionDays || []) {
      contributions.push({ date: d.date, count: d.contributionCount });
    }
  }

  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  // Cache at the edge for 10 min; today's count refreshes promptly without hammering GitHub.
  res.setHeader("cache-control", "public, max-age=0, s-maxage=600, stale-while-revalidate=600");
  res.end(JSON.stringify({ contributions }));
}
