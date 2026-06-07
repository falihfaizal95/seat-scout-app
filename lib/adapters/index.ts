import { ticketmasterAdapter } from "./ticketmaster";
import { seatgeekAdapter } from "./seatgeek";
import type { TicketAdapter } from "./types";

export const ALL_ADAPTERS: TicketAdapter[] = [
  ticketmasterAdapter, seatgeekAdapter,
];

export const SEARCH_ADAPTERS: TicketAdapter[] = [ticketmasterAdapter, seatgeekAdapter];

export { ticketmasterAdapter, seatgeekAdapter };
