/* Alt text for each project's screenshot, describing what the picture shows.
   Shared by the Work folders and the case-study page. Keyed by project slug;
   a slug missing here falls back to a generic description. */
const SHOT_ALT: Record<string, string> = {
  curate: "Curate's Explore page: a grid of Amazon India products with prices and Buy buttons",
  saral: "Saral's sign-in screen: a name and mobile form beside a list of sandbox demo accounts with their policy claims",
  repolens: "RepoLens system overview: a unified risk score of 57.1 out of 100 above component metrics and a DORA snapshot",
  inferlog: "InferLog analytics dashboard: request, error-rate, latency and token totals above latency and requests-per-hour charts",
  codesentinel: "CodeSentinel's VS Code Marketplace listing with its Install button, description and feature list",
  zync: "Zync dashboard: a greeting, today's focus, active goals with progress bars and a productivity panel",
  "infinite-canvas-rpg": "Infinite Canvas RPG mid-run: a pixel dungeon of green tiles with health, weapon and floor panels, a narrator box and accessibility settings",
  stockwise: "StockWise welcome screen: a cartoon guide named Jasper asking for your name beside a journey checklist",
  mandala: "Mandala Studio: a glowing multicoloured generative mandala beside geometry, colour, effect and audio controls",
  portfolio: "The previous version of this portfolio: a dark hero reading Soumya Gupta, I build the whole stack, over red terrain lines",
  splitsense: "SplitSense screenshot",
};

export function shotAlt(slug: string, title: string): string {
  return SHOT_ALT[slug] ?? `${title}: screenshot of the running app`;
}
