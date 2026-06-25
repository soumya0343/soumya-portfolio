import type { IncomingMessage, ServerResponse } from "node:http";

const USER = process.env.GITHUB_USER;

// No from/to: GitHub returns the trailing year bucketed in the account's
// configured timezone, matching the public profile calendar exactly. Passing
// UTC from/to mis-buckets days near the IST/UTC boundary and undercounts today.
const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
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
        variables: { login: USER },
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
  // Cache at the edge for 60s, serving stale while it revalidates, so today's count
  // refreshes within ~a minute without hammering GitHub on every page view.
  res.setHeader("cache-control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.end(JSON.stringify({ contributions }));
}
