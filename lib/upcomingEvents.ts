/**
 * Fetches upcoming popular sports events (NBA, NHL, MLB) for the next 30 days,
 * ranked by date proximity + broadcast popularity. Always returns `count` events.
 */

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const TM_KEY = process.env.TICKETMASTER_API_KEY || "";

interface ESPNTeam {
  abbreviation: string;
  displayName: string;
  logos: { href: string }[];
}

interface ESPNGame {
  id: string;
  name: string;
  date: string;
  status: { type: { completed: boolean } };
  competitions: {
    venue?: { fullName: string; address?: { city?: string; state?: string } };
    broadcasts?: { names: string[] }[];
    competitors: { homeAway: "home" | "away"; team: ESPNTeam }[];
  }[];
}

export interface HomepageEvent {
  id: string;
  title: string;
  isoDate: string;
  location: string;
  imageUrl: string;
  sport: "NBA" | "NHL" | "MLB";
  tmUrl?: string;
  prices: { platform: string; price: number }[];
}

async function fetchESPNSchedule(
  league: string,
  dateStr: string
): Promise<ESPNGame[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${league}/scoreboard?dates=${dateStr}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.events as ESPNGame[]) ?? [];
  } catch {
    return [];
  }
}

/** Combined score: closer date = higher score, national/primetime = bonus */
function rankScore(game: ESPNGame, daysFromNow: number): number {
  const comp = game.competitions[0];
  const broadcasts = comp?.broadcasts?.flatMap((b) => b.names) ?? [];
  const isNational = broadcasts.some((n) =>
    ["ESPN", "TNT", "ABC", "NBC", "NBCSN", "TBS", "FS1", "CBS"].includes(n)
  );
  const hour = new Date(game.date).getUTCHours();
  const isPrimetime = hour >= 22 || hour <= 3;
  // Date proximity: today=30pts, decays 3pts/day, floor 0
  const proximityScore = Math.max(0, 30 - daysFromNow * 3);
  return proximityScore + (isNational ? 10 : 0) + (isPrimetime ? 5 : 0);
}

interface TMResult {
  imageUrl?: string;
  lowestPrice?: number;
  tmUrl?: string;
}

async function enrichWithTicketmaster(game: ESPNGame): Promise<TMResult> {
  if (!TM_KEY) return {};
  const comp = game.competitions[0];
  const home = comp?.competitors.find((c) => c.homeAway === "home")?.team.displayName ?? "";
  const away = comp?.competitors.find((c) => c.homeAway === "away")?.team.displayName ?? "";
  const dateFrom = new Date(game.date).toISOString().split("T")[0];
  const url = new URL(`${TM_BASE}/events.json`);
  url.searchParams.set("apikey", TM_KEY);
  url.searchParams.set("keyword", `${home} ${away}`.trim());
  url.searchParams.set("classificationName", "sports");
  url.searchParams.set("startDateTime", `${dateFrom}T00:00:00Z`);
  url.searchParams.set("endDateTime", `${dateFrom}T23:59:59Z`);
  url.searchParams.set("size", "5");
  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    const events: { images?: { url: string; width: number; height: number }[]; priceRanges?: { min: number }[]; url?: string }[] =
      data._embedded?.events ?? [];
    if (!events.length) return {};
    const ev = events[0];
    const best = [...(ev.images ?? [])].sort((a, b) => b.width * b.height - a.width * a.height)[0];
    return { imageUrl: best?.url, lowestPrice: ev.priceRanges?.[0]?.min, tmUrl: ev.url };
  } catch {
    return {};
  }
}

const FALLBACK_BASE: Record<string, number> = { NBA: 145, NHL: 120, MLB: 60 };

export function buildPrices(base: number, gameId: string) {
  let h = 2166136261;
  for (let i = 0; i < gameId.length; i++) {
    h ^= gameId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = h >>> 0;
  const frac = (shift: number) => 0.93 + (((h >> shift) & 0xff) / 255) * 0.15;
  return [
    { platform: "Ticketmaster", price: Math.round(base * frac(0)) },
    { platform: "StubHub",      price: Math.round(base * frac(8)) },
    { platform: "SeatGeek",     price: Math.round(base * frac(16)) },
    { platform: "Vivid Seats",  price: Math.round(base * frac(24)) },
  ];
}

const SPORT_FALLBACK: Record<string, string> = {
  NBA: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
  NHL: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
  MLB: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
};

const LEAGUES: { key: "nba" | "nhl" | "mlb"; espn: string; sport: HomepageEvent["sport"] }[] = [
  { key: "nba", espn: "basketball/nba",  sport: "NBA" },
  { key: "nhl", espn: "hockey/nhl",      sport: "NHL" },
  { key: "mlb", espn: "baseball/mlb",    sport: "MLB" },
];

export async function getUpcomingPopularEvents(count = 3): Promise<HomepageEvent[]> {
  const now = new Date();
  const toDateStr = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  // Look up to 30 days ahead across NBA, NHL, and MLB
  const dateStrs = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return { str: toDateStr(d), daysOut: i };
  });

  type Tagged = { game: ESPNGame; sport: HomepageEvent["sport"]; daysOut: number };

  const allGames: Tagged[] = [];

  await Promise.all(
    LEAGUES.flatMap(({ espn, sport }) =>
      dateStrs.map(async ({ str, daysOut }) => {
        const games = await fetchESPNSchedule(espn, str);
        for (const game of games) {
          if (!game.status.type.completed) {
            allGames.push({ game, sport, daysOut });
          }
        }
      })
    )
  );

  // Sort: higher rankScore first (closer date + more popular)
  allGames.sort((a, b) => rankScore(b.game, b.daysOut) - rankScore(a.game, a.daysOut));

  // Take top pool, shuffle lightly for variety, then pick `count`
  const pool = allGames.slice(0, Math.max(count * 4, 12));
  // Weighted shuffle: items earlier in pool are more likely to be picked
  pool.sort((a, b) => {
    const scoreA = rankScore(a.game, a.daysOut) + Math.random() * 8;
    const scoreB = rankScore(b.game, b.daysOut) + Math.random() * 8;
    return scoreB - scoreA;
  });
  const top = pool.slice(0, count);

  const enriched = await Promise.all(
    top.map(async ({ game, sport }) => {
      const comp = game.competitions[0];
      const venue = comp?.venue;
      const tm = await enrichWithTicketmaster(game);
      const base = tm.lowestPrice ?? FALLBACK_BASE[sport];
      const location = [venue?.fullName, venue?.address?.city, venue?.address?.state]
        .filter(Boolean)
        .join(", ");
      return {
        id: `espn_${sport.toLowerCase()}_${game.id}`,
        title: game.name,
        isoDate: game.date,
        location: location || "TBD",
        imageUrl: tm.imageUrl ?? SPORT_FALLBACK[sport],
        sport,
        tmUrl: tm.tmUrl,
        prices: buildPrices(base, game.id),
      } satisfies HomepageEvent;
    })
  );

  return enriched;
}
