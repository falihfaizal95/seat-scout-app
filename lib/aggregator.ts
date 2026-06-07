import { ALL_ADAPTERS, SEARCH_ADAPTERS } from "./adapters";
import type { NormalizedEvent, EventSearchParams } from "@/types/event";
import type { TicketListing, AggregatedTickets } from "@/types/ticket";
import { parseEventId } from "./utils";

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

export async function aggregateTickets(eventId: string): Promise<AggregatedTickets> {
  const { source, externalId } = parseEventId(eventId);
  const platform = SOURCE_TO_PLATFORM[source];
  const adapters = platform
    ? ALL_ADAPTERS.filter((a) => a.platform === platform)
    : ALL_ADAPTERS;
  const results = await Promise.allSettled(
    adapters.map((adapter) => adapter.getTickets(externalId))
  );
  const allListings: TicketListing[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allListings.push(...result.value);
    } else {
      console.warn("[Aggregator] Adapter failed:", result.reason);
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
