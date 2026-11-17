import type { TicketAdapter, NormalizedEvent, EventSearchParams, TicketListing } from "./types";
import { generateEventId } from "@/lib/utils";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = process.env.TICKETMASTER_API_KEY || "";

interface TMEvent {
  id: string;
  name: string;
  dates: { start: { localDate: string; localTime?: string; dateTime?: string } };
  images: Array<{ url: string; ratio?: string; width: number; height: number; fallback?: boolean }>;
  priceRanges?: Array<{ type: string; min: number; max: number; currency: string }>;
  url: string;
  _embedded?: {
    venues?: Array<{ name: string; city: { name: string }; state?: { name: string; stateCode: string }; country: { name: string; countryCode: string } }>;
    attractions?: Array<{ name: string; images?: Array<{ url: string }> }>;
  };
  classifications?: Array<{ segment?: { name: string }; genre?: { name: string }; subGenre?: { name: string } }>;
}

function mapSport(classification?: TMEvent["classifications"]): string {
  const segment = classification?.[0]?.segment?.name || "";
  if (segment === "Music") return "Concert";
  if (segment === "Arts & Theatre") return "Theatre";
  const genre = classification?.[0]?.genre?.name || "";
  const sub = classification?.[0]?.subGenre?.name || "";
  // Ticketmaster's subGenre is the league ("NBA", "College", "G League"...)
  if (["NFL", "NBA", "MLB", "NHL", "MLS"].includes(sub)) return sub;
  const g = genre.toLowerCase();
  if (sub === "College" && g.includes("basketball")) return "NCAAB";
  if (sub === "College" && g.includes("football")) return "NCAAF";
  if (g.includes("soccer")) return "Soccer";
  return genre && genre !== "Miscellaneous" && genre !== "Undefined" ? genre : "Other";
}

/**
 * The event's own artwork (tour poster / banner), widest landscape version.
 * Ticketmaster marks generic category stock photos as `fallback`; never use those.
 */
function getBestImage(images: TMEvent["images"]): string | undefined {
  const own = images.filter((i) => !i.fallback);
  const wide = own.filter((i) => i.ratio === "16_9" && i.width <= 2048);
  return [...(wide.length ? wide : own)].sort((a, b) => b.width * b.height - a.width * a.height)[0]?.url;
}

export const ticketmasterAdapter: TicketAdapter = {
  platform: "ticketmaster",

  async searchEvents(params: EventSearchParams): Promise<NormalizedEvent[]> {
    if (!API_KEY) { console.warn("[Ticketmaster] No API key"); return []; }
    const url = new URL(`${BASE_URL}/events.json`);
    url.searchParams.set("apikey", API_KEY);
    url.searchParams.set("keyword", params.query);
    // Concerts, theatre and comedy too, not only sports
    if (params.sport) url.searchParams.set("classificationName", params.sport);
    url.searchParams.set("size", String(params.limit || 20));
    if (params.dateFrom) url.searchParams.set("startDateTime", `${params.dateFrom}T00:00:00Z`);
    if (params.dateTo)   url.searchParams.set("endDateTime",   `${params.dateTo}T23:59:59Z`);
    if (params.city)     url.searchParams.set("city", params.city);
    try {
      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`TM API error: ${res.status}`);
      const data = await res.json();
      const events: TMEvent[] = data._embedded?.events || [];
      return events.map((e) => {
        const venue = e._embedded?.venues?.[0];
        const attractions = e._embedded?.attractions || [];
        const priceRange = e.priceRanges?.[0];
        const segment = e.classifications?.[0]?.segment?.name;
        // Only games have two teams; a concert lists headliner + openers
        const isGame = segment === "Sports" && attractions.length >= 2;
        const dateStr = e.dates.start.dateTime || `${e.dates.start.localDate}T${e.dates.start.localTime || "19:00:00"}`;
        return {
          id: generateEventId("tm", e.id),
          name: e.name,
          sport: mapSport(e.classifications),
          segment,
          league: e.classifications?.[0]?.genre?.name,
          homeTeam: isGame ? attractions[0]?.name : undefined,
          awayTeam: isGame ? attractions[1]?.name : undefined,
          homeTeamLogo: isGame ? attractions[0]?.images?.[0]?.url : undefined,
          awayTeamLogo: isGame ? attractions[1]?.images?.[0]?.url : undefined,
          venue: venue?.name || "TBD",
          city: venue?.city?.name || "",
          state: venue?.state?.stateCode,
          country: venue?.country?.countryCode || "US",
          eventDate: dateStr,
          imageUrl: getBestImage(e.images),
          lowestPrice: priceRange?.min,
          averagePrice: priceRange ? (priceRange.min + priceRange.max) / 2 : undefined,
          url: e.url,
          source: "ticketmaster",
          externalIds: { ticketmaster: e.id },
        };
      });
    } catch (err) {
      console.error("[Ticketmaster] searchEvents error:", err);
      return [];
    }
  },

  async getTickets(externalEventId: string): Promise<TicketListing[]> {
    if (!API_KEY) return [];
    const url = new URL(`${BASE_URL}/events/${externalEventId}.json`);
    url.searchParams.set("apikey", API_KEY);
    try {
      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`TM event fetch error: ${res.status}`);
      const e: TMEvent = await res.json();
      if (!e.priceRanges?.length) return [];
      return e.priceRanges.map((range, i) => ({
        id: `tm_${externalEventId}_${i}`,
        platform: "ticketmaster" as const,
        eventId: generateEventId("tm", externalEventId),
        externalEventId,
        section: range.type === "resale" ? "Resale – Various" : "Official – Various",
        row: null,
        quantity: 2,
        pricePerTicket: range.min,
        totalPrice: range.min * 2,
        currency: range.currency || "USD",
        buyUrl: e.url,
        listingFetchedAt: new Date(),
        isVerified: true,
        isMock: false,
      }));
    } catch (err) {
      console.error("[Ticketmaster] getTickets error:", err);
      return [];
    }
  },
};
