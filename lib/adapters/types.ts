import type { NormalizedEvent, EventSearchParams } from "@/types/event";
import type { TicketListing, Platform } from "@/types/ticket";

export interface TicketAdapter {
  platform: Platform;
  searchEvents(params: EventSearchParams): Promise<NormalizedEvent[]>;
  getTickets(externalEventId: string, eventName?: string): Promise<TicketListing[]>;
}

export type { NormalizedEvent, EventSearchParams, TicketListing, Platform };
