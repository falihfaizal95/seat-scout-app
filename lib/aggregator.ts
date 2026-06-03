import { ALL_ADAPTERS, SEARCH_ADAPTERS } from "./adapters";
import type { NormalizedEvent, EventSearchParams } from "@/types/event";
import type { TicketListing, AggregatedTickets } from "@/types/ticket";
import { parseEventId } from "./utils";

export async function searchEvents(
  params: EventSearchParams
): Promise<NormalizedEvent[]> {
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

  // Sort by date ascending
  return allEvents.sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );
}

export async function aggregateTickets(
  eventId: string
): Promise<AggregatedTickets> {
  const { source, externalId } = parseEventId(eventId);

  // Run all adapters in parallel — tolerate individual failures
  const results = await Promise.allSettled(
    ALL_ADAPTERS.map((adapter) =>
      adapter.getTickets(externalId)
    )
  );

  const allListings: TicketListing[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allListings.push(...result.value);
    } else {
      console.warn("[Aggregator] Adapter failed:", result.reason);
    }
  }

  // Sort by price ascending
  const sorted = allListings.sort((a, b) => a.pricePerTicket - b.pricePerTicket);

  const prices = sorted.map((l) => l.pricePerTicket).filter((p) => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const averagePrice =
    prices.length > 0
      ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100
      : null;

  const platformsAvailable = [...new Set(sorted.map((l) => l.platform))];

  return {
    eventId,
    listings: sorted,
    lowestPrice,
    averagePrice,
    platformsAvailable,
    fetchedAt: new Date(),
    fromCache: false,
  };
}
