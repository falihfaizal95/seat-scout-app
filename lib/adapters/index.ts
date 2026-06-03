import { ticketmasterAdapter } from "./ticketmaster";
import { seatgeekAdapter } from "./seatgeek";
import {
  stubhubAdapter,
  vividseatsAdapter,
  axsAdapter,
  gametimeAdapter,
  tickpickAdapter,
} from "./mocks";
import type { TicketAdapter } from "./types";

export const ALL_ADAPTERS: TicketAdapter[] = [
  ticketmasterAdapter,
  seatgeekAdapter,
  stubhubAdapter,
  vividseatsAdapter,
  axsAdapter,
  gametimeAdapter,
  tickpickAdapter,
];

export const SEARCH_ADAPTERS: TicketAdapter[] = [
  ticketmasterAdapter,
  seatgeekAdapter,
];

export {
  ticketmasterAdapter,
  seatgeekAdapter,
  stubhubAdapter,
  vividseatsAdapter,
  axsAdapter,
  gametimeAdapter,
  tickpickAdapter,
};
