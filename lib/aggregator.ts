import { ALL_ADAPTERS, SEARCH_ADAPTERS } from "./adapters";
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

/** Search TM by event name, return ticket listings from first matching event */
async function tmListingsByName(eventName: string): Promise<TicketListing[]> {
  if (!TM_KEY || !eventName) return [];
  try {
    const url = new URL(`${TM_BASE}/events.json`);
    url.searchParams.set("apikey", TM_KEY);
    url.searchParams.set("keyword", eventName);
    url.searchParams.set("classificationName", "sports");
    url.searchParams.set("size", "3");
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const events: { id: string; priceRanges?: { type: string; min: number; currency: string }[]; url: string }[] =
      data._embedded?.events ?? [];
    if (!events.length) return [];
    const ev = events[0];
    if (!ev.priceRanges?.length) return [];
    return ev.priceRanges.map((range, i) => ({
      id: `tm_name_${ev.id}_${i}`,
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
    }));
  } catch { return []; }
}

/** Search SeatGeek by event name, return a synthetic listing from stats.lowest_price */
async function sgListingsByName(eventName: string): Promise<TicketListing[]> {
  if (!SG_CLIENT || !eventName) return [];
  try {
    const url = new URL(`${SG_BASE}/events`);
    url.searchParams.set("client_id", SG_CLIENT);
    url.searchParams.set("q", eventName);
    url.searchParams.set("type", "sports");
    url.searchParams.set("per_page", "3");
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const events: { id: number; url: string; stats: { lowest_price?: number } }[] = data.events ?? [];
    if (!events.length) return [];
    const ev = events[0];
    const price = ev.stats.lowest_price;
    if (!price) return [];
    return [{
      id: `sg_name_${ev.id}_0`,
      platform: "seatgeek" as const,
      eventId: generateEventId("sg", String(ev.id)),
      externalEventId: String(ev.id),
      section: "Various",
      row: null,
      quantity: 2,
      pricePerTicket: price,
      totalPrice: price * 2,
      currency: "USD",
      buyUrl: ev.url,
      listingFetchedAt: new Date(),
      isVerified: true,
      isMock: false,
    }];
  } catch { return []; }
}

export async function aggregateTickets(eventId: string, eventName?: string): Promise<AggregatedTickets> {
  const { source, externalId } = parseEventId(eventId);
  const platform = SOURCE_TO_PLATFORM[source];

  let allListings: TicketListing[] = [];

  if (source === "espn" || !platform) {
    // No direct platform mapping — search both TM and SeatGeek by name
    const [tmListings, sgListings] = await Promise.all([
      tmListingsByName(eventName ?? ""),
      sgListingsByName(eventName ?? ""),
    ]);
    allListings = [...tmListings, ...sgListings];
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

    // If direct lookup returned nothing, fall back to name search
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
