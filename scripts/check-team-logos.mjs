// Verifies lib/teamLogos.ts against ESPN: every team we list must exist on ESPN
// under the same name, use that team's own logo, and the logo URL must load.
// Run: npm run check:logos   (exits 1 on any problem)
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../lib/teamLogos.ts", import.meta.url), "utf8");
const ours = [...src.matchAll(/^\s*"([^"]+)": \{ league: "(\w+)", abbr: "(\w+)", color: "\w*", logo: "([^"]+)" \}/gm)]
  .map(([, name, league, abbr, logo]) => ({ name, league, abbr, logo }));

const PATHS = { NBA: "basketball/nba", NFL: "football/nfl", MLB: "baseball/mlb", NHL: "hockey/nhl" };
const problems = [];

for (const [league, path] of Object.entries(PATHS)) {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/teams?limit=50`);
  const espn = (await res.json()).sports[0].leagues[0].teams.map((t) => t.team);
  const mine = ours.filter((t) => t.league === league);
  if (mine.length !== espn.length) problems.push(`${league}: we list ${mine.length} teams, ESPN has ${espn.length}`);
  for (const t of mine) {
    const e = espn.find((x) => x.displayName === t.name);
    if (!e) { problems.push(`${t.name}: not found on ESPN (renamed?)`); continue; }
    if (e.abbreviation !== t.abbr || e.logos[0].href !== t.logo) problems.push(`${t.name}: logo/abbr differs from ESPN`);
  }
}

await Promise.all(ours.map(async (t) => {
  const r = await fetch(t.logo, { method: "HEAD" });
  if (!r.ok || !r.headers.get("content-type")?.startsWith("image/")) problems.push(`${t.name}: logo URL broken (${r.status})`);
}));

if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`OK: ${ours.length} team logos match ESPN and load.`);
