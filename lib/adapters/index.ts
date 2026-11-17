import { ticketmasterAdapter } from "./ticketmaster";
import { seatgeekAdapter } from "./seatgeek";
import type { TicketAdapter } from "./types";

// Only sites we get real data from. Every other site is shown as a
// "check this site" link (see lib/platformLinks.ts), never with made-up prices.
export const ALL_ADAPTERS: TicketAdapter[] = [ticketmasterAdapter, seatgeekAdapter];

export const SEARCH_ADAPTERS: TicketAdapter[] = [ticketmasterAdapter, seatgeekAdapter];

export { ticketmasterAdapter, seatgeekAdapter };
