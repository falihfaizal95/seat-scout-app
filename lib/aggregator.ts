import { ALL_ADAPTERS, MOCK_ADAPTERS, SEARCH_ADAPTERS } from "./adapters";
import type { NormalizedEvent, EventSearchParams } from "@/types/event";
import type { TicketListing, AggregatedTickets } from "@/types/ticket";
import { parseEventId, generateEventId } from "./utils";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const TM_KEY = process.env.TICKETMASTER_API_KEY || "";
const SG_BASE = "https://api.seatgeek.com/2";
const SG_CLIENT = process.env.SEATGEEK_CLIENT_ID || "";

export async function searchEvents(params: EventSearchParams): Promise<NormalizedEvent[]> {
  const results = await Promise.allSettled(
    SEARCH_ADAPTERS.map((adapter) => adapter.searchEvents(params))
  );
  const allEvents: NormalizedEvent[] = [];
  const seenIds = new Set<string>();
  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const event of result.value) {
        if (!seenIds.has(event.id)) {
          seenIds.add(event.id);
          allEvents.push(event);
        }
      }
    }
  }
  return allEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
}

const SOURCE_TO_PLATFORM: Record<string, string> = {
  tm: "ticketmaster",
  sg: "seatgeek",
};

/**
 * Extract a short search keyword from an event title.
 * "NBA Finals: San Antonio Spurs at New York Knicks Game 3" → "San Antonio Spurs New York Knicks"
 */
function extractKeyword(title: string): string {
  // Remove common prefixes like "NBA Finals:", "NHL Playoffs:", etc.
  let kw = title.replace(/^(nba|nhl|mlb|nfl|mls)\s+(finals?|playoffs?|championship)\s*[:–-]\s*/i, "");
  // Remove "Game N" suffix
  kw = kw.replace(/\s*Game\s+\d+\s*$/i, "").trim();
  // Replace " at " with " "
  kw = kw.replace(/\s+at\s+/i, " ");
  // Replace " vs.? " with " "
  kw = kw.replace(/\s+vs\.?\s+/i, " ");
  return kw.trim() || title;
}

/** Fetch ticket offers from TM Commerce API for a specific event ID */
async function tmOffersForEvent(eventId: string, buyUrl: string): Promise<TicketListing[]> {
  try {
    const url = `https://app.ticketmaster.com/commerce/v2/events/${eventId}/offers.json?apikey=${TM_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const offers: { id: string; name?: string; prices?: { value: number; currency: string }[] }[] =
      data._embedded?.offers ?? data.offers ?? [];
    if (!offers.length) return [];
    return offers.slice(0, 6).flatMap((offer, i) => {
      const price = offer.prices?.[0]?.value ?? 0;
      if (!price || price <= 0) return [];
      return [{
        id: `tm_offer_${eventId}_${i}`,
        platform: "ticketmaster" as const,
        eventId: generateEventId("tm", eventId),
        externalEventId: eventId,
        section: offer.name ?? "Various",
        row: null,
        quantity: 2,
        pricePerTicket: price,
        totalPrice: price * 2,
        currency: offer.prices?.[0]?.currency ?? "USD",
        buyUrl,
        listingFetchedAt: new Date(),
        isVerified: true,
        isMock: false,
      }];
    });
  } catch { return []; }
}

/** Search TM by event name keyword, return listings from Commerce API offers */
async function tmListingsByName(eventName: string): Promise<TicketListing[]> {
  if (!TM_KEY || !eventName) return [];
  const keyword = extractKeyword(eventName);
  try {
    const url = new URL(`${TM_BASE}/events.json`);
    url.searchParams.set("apikey", TM_KEY);
    url.searchParams.set("keyword", keyword);
    url.searchParams.set("classificationName", "sports");
    url.searchParams.set("size", "3");
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const events: {
      id: string;
      priceRanges?: { type: string; min: number; max?: number; currency: string }[];
      url: string;
    }[] = data._embedded?.events ?? [];

    const listings: TicketListing[] = [];
    for (const ev of events.slice(0, 2)) {
      // Try priceRanges first (rarely populated but instant)
      if (ev.priceRanges?.length) {
        for (let i = 0; i < ev.priceRanges.length; i++) {
          const range = ev.priceRanges[i];
          if (!range.min || range.min <= 0) continue;
          listings.push({
            id: `tm_range_${ev.id}_${i}`,
            platform: "ticketmaster" as const,
            eventId: generateEventId("tm", ev.id),
            externalEventId: ev.id,
            section: range.type === "resale" ? "Resale – Various" : "Official – Various",
            row: null,
            quantity: 2,
            pricePerTicket: range.min,
            totalPrice: range.min * 2,
            currency: range.currency || "USD",
            buyUrl: ev.url,
            listingFetchedAt: new Date(),
            isVerified: true,
            isMock: false,
          });
        }
      } else {
        // Fall back to Commerce API
        const offers = await tmOffersForEvent(ev.id, ev.url);
        listings.push(...offers);
      }
    }
    return listings;
  } catch { return []; }
}

/** Search SeatGeek by event name, then fetch real listings using the event ID */
async function sgListingsByName(eventName: string): Promise<TicketListing[]> {
  if (!eventName) return [];

  // Try multiple keyword variations to maximize match chances
  const keywords = [extractKeyword(eventName), eventName.split(" at ")[1]?.trim(), eventName.split(" at ")[0]?.replace(/^.*:\s*/, "").trim()].filter(Boolean) as string[];

  let sgEventId: number | null = null;
  let sgEventUrl = "";

  for (const keyword of keywords) {
    try {
      const url = new URL(`${SG_BASE}/events`);
      if (SG_CLIENT) url.searchParams.set("client_id", SG_CLIENT);
      url.searchParams.set("q", keyword);
      url.searchParams.set("per_page", "3");
      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (!res.ok) continue;
      const data = await res.json();
      const events: { id: number; url: string; stats: { lowest_price?: number; average_price?: number } }[] = data.events ?? [];
      if (events.length > 0) {
        sgEventId = events[0].id;
        sgEventUrl = events[0].url;
        break;
      }
    } catch { continue; }
  }

  if (!sgEventId) return [];

  // Try real listings endpoint first
  try {
    const listUrl = new URL(`${SG_BASE}/listings`);
    if (SG_CLIENT) listUrl.searchParams.set("client_id", SG_CLIENT);
    listUrl.searchParams.set("event_id", String(sgEventId));
    listUrl.searchParams.set("per_page", "30");
    const listRes = await fetch(listUrl.toString(), { next: { revalidate: 300 } });
    if (listRes.ok) {
      const listData = await listRes.json();
      const listings: { id: number; section: string; row?: string; quantity: number; price: { amount: number } }[] = listData.listings ?? [];
      if (listings.length > 0) {
        return listings.slice(0, 30).map((l, i) => ({
          id: `sg_listing_${sgEventId}_${i}`,
          platform: "seatgeek" as const,
          eventId: generateEventId("sg", String(sgEventId)),
          externalEventId: String(sgEventId),
          section: l.section || "General",
          row: l.row || null,
          quantity: l.quantity || 2,
          pricePerTicket: l.price?.amount || 0,
          totalPrice: (l.price?.amount || 0) * (l.quantity || 2),
          currency: "USD",
          buyUrl: sgEventUrl,
          listingFetchedAt: new Date(),
          isVerified: true,
          isMock: false,
        })).filter((l) => l.pricePerTicket > 0);
      }
    }
  } catch { /* fall through to stats */ }

  // Fall back to stats if listings endpoint fails
  try {
    const eventUrl = new URL(`${SG_BASE}/events/${sgEventId}`);
    if (SG_CLIENT) eventUrl.searchParams.set("client_id", SG_CLIENT);
    const eventRes = await fetch(eventUrl.toString(), { next: { revalidate: 300 } });
    if (eventRes.ok) {
      const ev: { stats: { lowest_price?: number; average_price?: number }; url: string } = await eventRes.json();
      const price = ev.stats.lowest_price || (ev.stats.average_price ? Math.round(ev.stats.average_price * 0.8) : 0);
      if (price > 0) {
        return [{
          id: `sg_stats_${sgEventId}_0`,
          platform: "seatgeek" as const,
          eventId: generateEventId("sg", String(sgEventId)),
          externalEventId: String(sgEventId),
          section: "Various",
          row: null,
          quantity: 2,
          pricePerTicket: price,
          totalPrice: price * 2,
          currency: "USD",
          buyUrl: ev.url || sgEventUrl,
          listingFetchedAt: new Date(),
          isVerified: true,
          isMock: false,
        }];
      }
    }
  } catch { /* no data available */ }

  return [];
}

export async function aggregateTickets(eventId: string, eventName?: string): Promise<AggregatedTickets> {
  const { source, externalId } = parseEventId(eventId);
  const platform = SOURCE_TO_PLATFORM[source];

  let allListings: TicketListing[] = [];

  if (source === "espn" || !platform) {
    // ESPN events: search TM+SG by name for real prices, fill rest with estimates
    const [tmListings, sgListings, ...mockResults] = await Promise.all([
      tmListingsByName(eventName ?? ""),
      sgListingsByName(eventName ?? ""),
      ...MOCK_ADAPTERS.map((a) => a.getTickets(externalId, eventName)),
    ]);
    allListings = [...tmListings, ...sgListings, ...mockResults.flat()];
  } else {
    // Direct platform lookup
    const adapters = ALL_ADAPTERS.filter((a) => a.platform === platform);
    const results = await Promise.allSettled(
      adapters.map((adapter) => adapter.getTickets(externalId))
    );
    for (const result of results) {
      if (result.status === "fulfilled") allListings.push(...result.value);
      else console.warn("[Aggregator] Adapter failed:", result.reason);
    }

    // Fallback to name-based search if direct lookup returned nothing
    if (allListings.length === 0 && eventName) {
      const [tmListings, sgListings] = await Promise.all([
        tmListingsByName(eventName),
        sgListingsByName(eventName),
      ]);
      allListings = [...tmListings, ...sgListings];
    }
  }

  const sorted = allListings.sort((a, b) => a.pricePerTicket - b.pricePerTicket);
  const prices = sorted.map((l) => l.pricePerTicket).filter((p) => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const averagePrice = prices.length > 0
    ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100
    : null;
  const platformsAvailable = [...new Set(sorted.map((l) => l.platform))];
  return { eventId, listings: sorted, lowestPrice, averagePrice, platformsAvailable, fetchedAt: new Date(), fromCache: false };
}
