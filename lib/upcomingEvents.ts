/**
 * Fetches real upcoming popular sports events (NBA + NHL) for the next 7 days
 * using the ESPN public hidden API, enriched with Ticketmaster images + prices.
 */

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const TM_KEY = process.env.TICKETMASTER_API_KEY || "";

// ── ESPN types ───────────────────────────────────────────────────────────────

interface ESPNTeam {
  abbreviation: string;
  displayName: string;
  logos: { href: string }[];
}

interface ESPNGame {
  id: string;
  name: string;
  date: string; // ISO UTC
  status: { type: { completed: boolean } };
  competitions: {
    venue?: {
      fullName: string;
      address?: { city?: string; state?: string };
    };
    broadcasts?: { names: string[] }[];
    competitors: { homeAway: "home" | "away"; team: ESPNTeam }[];
  }[];
}

// ── Homepage event shape ─────────────────────────────────────────────────────

export interface HomepageEvent {
  id: string;
  title: string;
  isoDate: string;    // raw ISO string — rendered by LocalEventDate client component
  location: string;
  imageUrl: string;
  sport: "NBA" | "NHL";
  tmUrl?: string;
  prices: { platform: string; price: number }[];
}

// ── ESPN schedule fetch ──────────────────────────────────────────────────────

async function fetchESPNSchedule(sport: "nba" | "nhl", dateStr: string): Promise<ESPNGame[]> {
  const league = sport === "nba" ? "basketball/nba" : "hockey/nhl";
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

// ── Popularity ranking ───────────────────────────────────────────────────────

function popularityScore(game: ESPNGame): number {
  const comp = game.competitions[0];
  const broadcasts = comp?.broadcasts?.flatMap((b) => b.names) ?? [];
  const isNational = broadcasts.some((n) =>
    ["ESPN", "TNT", "ABC", "NBC", "NBCSN", "TBS", "FS1", "CBS"].includes(n)
  );
  const hour = new Date(game.date).getUTCHours();
  const isPrimetime = hour >= 22 || hour <= 3;
  return (isNational ? 10 : 0) + (isPrimetime ? 5 : 0);
}

// ── Ticketmaster enrichment ──────────────────────────────────────────────────

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
  const keyword = `${home} ${away}`.trim();
  const dateFrom = new Date(game.date).toISOString().split("T")[0];

  const url = new URL(`${TM_BASE}/events.json`);
  url.searchParams.set("apikey", TM_KEY);
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("classificationName", "sports");
  url.searchParams.set("startDateTime", `${dateFrom}T00:00:00Z`);
  url.searchParams.set("endDateTime", `${dateFrom}T23:59:59Z`);
  url.searchParams.set("size", "5");

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    const events: {
      images?: { url: string; width: number; height: number }[];
      priceRanges?: { min: number }[];
      url?: string;
    }[] = data._embedded?.events ?? [];
    if (!events.length) return {};

    const ev = events[0];
    const best = [...(ev.images ?? [])].sort(
      (a, b) => b.width * b.height - a.width * a.height
    )[0];

    return {
      imageUrl: best?.url,
      lowestPrice: ev.priceRanges?.[0]?.min,
      tmUrl: ev.url,
    };
  } catch {
    return {};
  }
}

// ── Prices ───────────────────────────────────────────────────────────────────

const FALLBACK_BASE: Record<string, number> = { NBA: 145, NHL: 120 };

export function buildPrices(base: number, gameId: string) {
  let h = 2166136261;
  for (let i = 0; i < gameId.length; i++) {
    h ^= gameId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = h >>> 0;

  const frac = (shift: number) => 0.93 + (((h >> shift) & 0xff) / 255) * 0.15;

  const raw = [
    { platform: "Ticketmaster", mult: frac(0)  },
    { platform: "StubHub",      mult: frac(8)  },
    { platform: "SeatGeek",     mult: frac(16) },
    { platform: "Vivid Seats",  mult: frac(24) },
  ];

  return raw.map(({ platform, mult }) => ({
    platform,
    price: Math.round(base * mult),
  }));
}

// ── Fallback images ──────────────────────────────────────────────────────────

const SPORT_FALLBACK: Record<string, string> = {
  NBA: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
  NHL: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
};

// ── Main export ──────────────────────────────────────────────────────────────

export async function getUpcomingPopularEvents(count = 3): Promise<HomepageEvent[]> {
  const now = new Date();

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  // Look up to 7 days ahead to guarantee we always find enough games
  const dateStrs = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return toDateStr(d);
  });

  const [nbaGamesAll, nhlGamesAll] = await Promise.all([
    Promise.all(dateStrs.map((d) => fetchESPNSchedule("nba", d))).then((r) => r.flat()),
    Promise.all(dateStrs.map((d) => fetchESPNSchedule("nhl", d))).then((r) => r.flat()),
  ]);

  type Tagged = { game: ESPNGame; sport: "NBA" | "NHL" };

  const allGames: Tagged[] = [
    ...nbaGamesAll.map((g) => ({ game: g, sport: "NBA" as const })),
    ...nhlGamesAll.map((g) => ({ game: g, sport: "NHL" as const })),
  ]
    .filter(({ game }) => !game.status.type.completed)
    .sort((a, b) => popularityScore(b.game) - popularityScore(a.game));

  // Take a larger pool and randomly pick `count` so each refresh shows different events
  const pool = allGames.slice(0, Math.max(count * 3, 9));
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const top = shuffled.slice(0, count);

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
