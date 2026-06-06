import { NextRequest, NextResponse } from "next/server";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";

const SPORT_TEAMS: Record<string, string> = {
  hawks: "Basketball", lakers: "Basketball", warriors: "Basketball", celtics: "Basketball",
  bulls: "Basketball", heat: "Basketball", knicks: "Basketball", nets: "Basketball",
  spurs: "Basketball", suns: "Basketball", nuggets: "Basketball", bucks: "Basketball",
  raptors: "Basketball", cavaliers: "Basketball", sixers: "Basketball",
  "76ers": "Basketball", pistons: "Basketball", pacers: "Basketball",
  hornets: "Basketball", wizards: "Basketball", magic: "Basketball",
  pelicans: "Basketball", grizzlies: "Basketball", thunder: "Basketball",
  blazers: "Basketball", kings: "Basketball", timberwolves: "Basketball",
  jazz: "Basketball", rockets: "Basketball", mavericks: "Basketball",
  mavs: "Basketball", clippers: "Basketball",
  cowboys: "American Football", patriots: "American Football", chiefs: "American Football",
  eagles: "American Football", packers: "American Football", steelers: "American Football",
  ravens: "American Football", broncos: "American Football", seahawks: "American Football",
  "49ers": "American Football", rams: "American Football", saints: "American Football",
  bears: "American Football", giants: "American Football", jets: "American Football",
  bills: "American Football", dolphins: "American Football", colts: "American Football",
  titans: "American Football", texans: "American Football", jaguars: "American Football",
  bengals: "American Football", browns: "American Football", raiders: "American Football",
  chargers: "American Football", vikings: "American Football", lions: "American Football",
  falcons: "American Football", panthers: "American Football", buccaneers: "American Football",
  cardinals: "American Football", commanders: "American Football",
  yankees: "Baseball", dodgers: "Baseball", "red sox": "Baseball", cubs: "Baseball",
  mets: "Baseball", braves: "Baseball", astros: "Baseball", phillies: "Baseball",
  padres: "Baseball", brewers: "Baseball", mariners: "Baseball", athletics: "Baseball",
  rangers: "Baseball", angels: "Baseball", tigers: "Baseball", twins: "Baseball",
  royals: "Baseball", guardians: "Baseball", orioles: "Baseball", bluejays: "Baseball",
  "blue jays": "Baseball", rays: "Baseball", "white sox": "Baseball", reds: "Baseball",
  rockies: "Baseball", diamondbacks: "Baseball", marlins: "Baseball", pirates: "Baseball",
  nationals: "Baseball",
  bruins: "Ice Hockey", blackhawks: "Ice Hockey", penguins: "Ice Hockey",
  lightning: "Ice Hockey", avalanche: "Ice Hockey", canadiens: "Ice Hockey",
  oilers: "Ice Hockey", flames: "Ice Hockey", canucks: "Ice Hockey",
  senators: "Ice Hockey", sabres: "Ice Hockey", hurricanes: "Ice Hockey",
  capitals: "Ice Hockey", flyers: "Ice Hockey", devils: "Ice Hockey",
  islanders: "Ice Hockey", wild: "Ice Hockey", predators: "Ice Hockey",
  blues: "Ice Hockey", ducks: "Ice Hockey", sharks: "Ice Hockey",
};

function detectSportClassification(query: string): string | null {
  const q = query.toLowerCase().trim();
  for (const [keyword, classification] of Object.entries(SPORT_TEAMS)) {
    if (q.includes(keyword)) return classification;
  }
  return null;
}

interface TMAttr { name: string; images?: Array<{ url: string; width: number; height: number }>; }
interface TMRawEvent {
  id: string; name: string; url: string;
  dates: { start: { localDate: string; localTime?: string; dateTime?: string } };
  images: Array<{ url: string; ratio?: string; width: number; height: number }>;
  priceRanges?: Array<{ min: number; max: number }>;
  classifications?: Array<{ segment?: { name: string }; genre?: { name: string } }>;
  _embedded?: {
    venues?: Array<{ name: string; city: { name: string }; state?: { stateCode: string }; country?: { countryCode: string } }>;
    attractions?: TMAttr[];
  };
}

function bestAttrImage(attr: TMAttr | undefined): string | undefined {
  if (!attr?.images?.length) return undefined;
  return [...attr.images].sort((a, b) => b.width * b.height - a.width * a.height)[0]?.url;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? "0";
  const classificationName = searchParams.get("classificationName") ?? "";

  if (!q.trim() && !classificationName) {
    return NextResponse.json({ events: [], total: 0 }, { status: 400 });
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Ticketmaster API key not configured" }, { status: 500 });
  }

  const detectedSport = detectSportClassification(q);
  const effectiveClassification = classificationName || detectedSport || "";

  const url = new URL(`${TM_BASE}/events.json`);
  if (q.trim()) url.searchParams.set("keyword", q);
  url.searchParams.set("size", q.trim() ? "20" : "50");
  url.searchParams.set("page", page);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("segmentName", "Sports");
  url.searchParams.set("sort", "date,asc");
  if (effectiveClassification) url.searchParams.set("classificationName", effectiveClassification);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`TM API error: ${res.status}`);
    const data = await res.json();
    const rawEvents: TMRawEvent[] = data._embedded?.events ?? [];

    const events = rawEvents.map((e) => {
      const venue = e._embedded?.venues?.[0];
      const attractions = e._embedded?.attractions ?? [];
      const cl = e.classifications?.[0];
      const segment = cl?.segment?.name ?? "Other";
      const genre = cl?.genre?.name ?? "";
      const isSpor = segment === "Sports";
      const image = e.images?.find((i) => i.ratio === "16_9" && i.width > 500)?.url ??
        [...(e.images ?? [])].sort((a, b) => b.width * b.height - a.width * a.height)[0]?.url;
      const dateStr = e.dates.start.dateTime ?? `${e.dates.start.localDate}T${e.dates.start.localTime ?? "19:00:00"}`;
      const homeAttr = isSpor ? attractions[0] : undefined;
      const awayAttr = isSpor ? attractions[1] : undefined;
      return {
        id: `tm_${e.id}`, name: e.name, sport: genre || segment, segment, league: genre,
        homeTeam: homeAttr?.name, awayTeam: awayAttr?.name,
        homeTeamLogo: bestAttrImage(homeAttr), awayTeamLogo: bestAttrImage(awayAttr),
        venue: venue?.name ?? "TBD", city: venue?.city?.name ?? "",
        state: venue?.state?.stateCode, country: venue?.country?.countryCode ?? "US",
        eventDate: dateStr, imageUrl: image,
        lowestPrice: e.priceRanges?.[0]?.min,
        averagePrice: e.priceRanges?.[0] ? (e.priceRanges[0].min + e.priceRanges[0].max) / 2 : undefined,
        url: e.url, source: "ticketmaster", externalIds: { ticketmaster: e.id },
      };
    });

    const sportsFiltered = detectedSport ? events.filter((e) => e.segment === "Sports") : events;
    const seen = new Set<string>();
    const filteredEvents = sportsFiltered.filter((e) => {
      const dateDay = e.eventDate?.slice(0, 10) ?? "";
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      const key = e.homeTeam && e.awayTeam ? `${norm(e.homeTeam)}|${norm(e.awayTeam)}|${dateDay}` : `${norm(e.name)}|${dateDay}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 20);

    return NextResponse.json({ events: filteredEvents, total: filteredEvents.length, page: data.page?.number ?? 0, totalPages: data.page?.totalPages ?? 1 }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[/api/search] error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
