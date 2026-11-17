/**
 * Fetches real upcoming popular games (NBA, NHL, MLB, World Cup) for the next
 * week from ESPN's public API, linked to the same game on Ticketmaster.
 *
 * Rules that keep cards honest:
 *  - No made-up prices. Only Ticketmaster's real minimum, when it gives one.
 *  - No stock photos. Team games show both teams' logos (see lib/teamLogos.ts);
 *    a Ticketmaster photo is only used when that event is verified to be this game.
 */
import { teamInfo, type TeamBadge } from "./teamLogos";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const TM_KEY = process.env.TICKETMASTER_API_KEY || "";

interface ESPNTeam {
  abbreviation: string;
  displayName: string;
  shortDisplayName?: string;
  color?: string;
  logo?: string;
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
  /** A photo of this exact event, or undefined (never a stock photo). */
  imageUrl?: string;
  /** Both teams, so the card can show their logos. */
  teams?: { home: TeamBadge; away: TeamBadge };
  sport: "NBA" | "NHL" | "MLB" | "MLS" | "NFL";
  tmUrl?: string;
  /** Ticketmaster's real minimum price, when Ticketmaster provides one. */
  lowestPrice?: number;
}

const LEAGUES = [
  { key: "nba", espn: "basketball/nba",   sport: "NBA" as const },
  { key: "nhl", espn: "hockey/nhl",       sport: "NHL" as const },
  { key: "mlb", espn: "baseball/mlb",     sport: "MLB" as const },
  { key: "wc",  espn: "soccer/fifa.world", sport: "MLS" as const },
];

async function fetchESPNSchedule(espnPath: string, dateStr: string): Promise<ESPNGame[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${espnPath}/scoreboard?dates=${dateStr}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.events as ESPNGame[]) ?? [];
  } catch {
    return [];
  }
}

function rankScore(game: ESPNGame, daysFromNow: number): number {
  const comp = game.competitions[0];
  const broadcasts = comp?.broadcasts?.flatMap((b) => b.names) ?? [];
  const isNational = broadcasts.some((n) =>
    ["ESPN", "TNT", "ABC", "NBC", "NBCSN", "TBS", "FS1", "CBS"].includes(n)
  );
  const hour = new Date(game.date).getUTCHours();
  const isPrimetime = hour >= 22 || hour <= 3;
  const proximityScore = Math.max(0, 30 - daysFromNow * 3);
  return proximityScore + (isNational ? 10 : 0) + (isPrimetime ? 5 : 0);
}

interface TMResult {
  imageUrl?: string;
  lowestPrice?: number;
  tmUrl?: string;
}

const nick = (t: ESPNTeam) => (t.shortDisplayName ?? t.displayName.split(" ").pop() ?? "").toLowerCase();

type TMImage = { url: string; ratio?: string; width: number; height: number };

/** The largest landscape image Ticketmaster has for an event. */
export function bestLandscape(images?: TMImage[]): string | undefined {
  const imgs = images ?? [];
  const wide = imgs.filter((i) => i.ratio === "16_9" && i.width >= 500);
  return [...(wide.length ? wide : imgs)].sort((a, b) => b.width * b.height - a.width * a.height)[0]?.url;
}

async function enrichWithTicketmaster(game: ESPNGame): Promise<TMResult> {
  if (!TM_KEY) return {};
  const comp = game.competitions[0];
  const home = comp?.competitors.find((c) => c.homeAway === "home")?.team;
  const away = comp?.competitors.find((c) => c.homeAway === "away")?.team;
  if (!home || !away) return {};
  const day = new Date(game.date).toISOString().split("T")[0];

  const url = new URL(`${TM_BASE}/events.json`);
  url.searchParams.set("apikey", TM_KEY);
  url.searchParams.set("keyword", home.displayName);
  url.searchParams.set("classificationName", "sports");
  url.searchParams.set("startDateTime", `${day}T00:00:00Z`);
  url.searchParams.set("endDateTime", `${day}T23:59:59Z`);
  url.searchParams.set("size", "10");

  try {
    // Cached so a burst of homepage visits doesn't hit Ticketmaster's rate limit
    const res = await fetch(url.toString(), { next: { revalidate: 900 } });
    if (!res.ok) return {};
    const data = await res.json();
    const events: {
      name: string;
      images?: TMImage[];
      priceRanges?: { min: number }[];
      url?: string;
      _embedded?: { attractions?: { name: string }[] };
    }[] = data._embedded?.events ?? [];

    // Only accept an event that is clearly this game: both team names appear
    const want = [nick(home), nick(away)];
    const ev = events.find((e) => {
      const text = [e.name, ...(e._embedded?.attractions ?? []).map((a) => a.name)].join(" ").toLowerCase();
      return want.every((w) => w && text.includes(w));
    });
    if (!ev) return {};
    return { imageUrl: bestLandscape(ev.images), lowestPrice: ev.priceRanges?.[0]?.min, tmUrl: ev.url };
  } catch {
    return {};
  }
}

/** Card badge for an ESPN competitor; pro teams use the verified logo map. */
function badge(team?: ESPNTeam): TeamBadge {
  const info = teamInfo(team?.displayName);
  return { name: team?.displayName ?? "", logo: info?.logo ?? team?.logo, color: info?.color ?? team?.color };
}

export async function getUpcomingPopularEvents(count = 3): Promise<HomepageEvent[]> {
  const now = new Date();
  const toDateStr = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  const datesToFetch: { date: Date; daysFromNow: number }[] = [];
  for (let i = 0; i <= 6; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    datesToFetch.push({ date: d, daysFromNow: i });
  }

  type Tagged = { game: ESPNGame; sport: HomepageEvent["sport"]; daysFromNow: number };

  const fetchPromises = LEAGUES.flatMap((league) =>
    datesToFetch.map(({ date, daysFromNow }) =>
      fetchESPNSchedule(league.espn, toDateStr(date)).then((games) =>
        games.map((game): Tagged => ({ game, sport: league.sport, daysFromNow }))
      )
    )
  );

  const allTaggedArrays = await Promise.all(fetchPromises);
  const allGames: Tagged[] = allTaggedArrays.flat()
    .filter(({ game }) => !game.status.type.completed)
    .sort((a, b) => rankScore(b.game, b.daysFromNow) - rankScore(a.game, a.daysFromNow));

  const seen = new Set<string>();
  const deduped = allGames.filter(({ game }) => {
    if (seen.has(game.id)) return false;
    seen.add(game.id);
    return true;
  });

  const pool = deduped.slice(0, Math.max(count * 3, 9));
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const top = shuffled.slice(0, count);

  const enriched = await Promise.all(
    top.map(async ({ game, sport }) => {
      const comp = game.competitions[0];
      const venue = comp?.venue;
      const tm = await enrichWithTicketmaster(game);
      const side = (h: "home" | "away") => comp?.competitors.find((c) => c.homeAway === h)?.team;
      const location = [venue?.fullName, venue?.address?.city, venue?.address?.state]
        .filter(Boolean).join(", ");
      return {
        id: `espn_${sport.toLowerCase()}_${game.id}`,
        title: game.name,
        isoDate: game.date,
        location: location || "TBD",
        imageUrl: tm.imageUrl,
        teams: { home: badge(side("home")), away: badge(side("away")) },
        sport,
        tmUrl: tm.tmUrl,
        lowestPrice: tm.lowestPrice,
      } satisfies HomepageEvent;
    })
  );

  return enriched;
}
