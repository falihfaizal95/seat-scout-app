/**
 * Mock adapters for platforms without public APIs.
 * Prices are deterministic per (eventId, platform) so results are
 * consistent across requests for the same event.
 */
import type { TicketAdapter, NormalizedEvent, EventSearchParams, TicketListing } from "./types";
import { generateEventId, seededRandom } from "@/lib/utils";
import type { Platform } from "@/types/ticket";

const SECTIONS = [
  "Lower Bowl 101",
  "Lower Bowl 108",
  "Lower Bowl 115",
  "Lower Bowl 122",
  "Club Level 201",
  "Club Level 208",
  "Club Level 215",
  "Upper Deck 301",
  "Upper Deck 312",
  "Upper Deck 325",
  "Field Level GA",
  "End Zone 130",
  "Corner 145",
];

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R"];

type UrlBuilder = (eventName: string, externalEventId: string) => string;

function createMockAdapter(
  platform: Platform,
  siteName: string,
  siteUrl: string,
  priceMultiplier: number,
  urlBuilder?: UrlBuilder
): TicketAdapter {
  return {
    platform,

    async searchEvents(_params: EventSearchParams): Promise<NormalizedEvent[]> {
      return [];
    },

    async getTickets(externalEventId: string, eventName?: string): Promise<TicketListing[]> {
      const rand = seededRandom(`${platform}_${externalEventId}`);
      const listingCount = Math.floor(rand() * 8) + 4;
      const listings: TicketListing[] = [];
      const q = encodeURIComponent(eventName ?? "");
      const buyUrl = urlBuilder && eventName
        ? urlBuilder(eventName, externalEventId)
        : q ? `${siteUrl}/search?q=${q}` : siteUrl;

      for (let i = 0; i < listingCount; i++) {
        const basePrice = 40 + rand() * 200;
        const price = Math.round(basePrice * priceMultiplier);
        const section = SECTIONS[Math.floor(rand() * SECTIONS.length)];
        const row = ROWS[Math.floor(rand() * ROWS.length)];
        const qty = Math.floor(rand() * 4) + 1;

        listings.push({
          id: `${platform}_${externalEventId}_${i}`,
          platform,
          eventId: generateEventId(platform.substring(0, 2), externalEventId),
          externalEventId,
          section,
          row,
          quantity: qty,
          pricePerTicket: price,
          totalPrice: price * qty,
          currency: "USD",
          buyUrl,
          listingFetchedAt: new Date(),
          isVerified: false,
          isMock: true,
        });
      }

      return listings.sort((a, b) => a.pricePerTicket - b.pricePerTicket);
    },
  };
}

export const stubhubAdapter = createMockAdapter(
  "stubhub",
  "StubHub",
  "https://www.stubhub.com",
  1.05,
  (name) => `https://www.stubhub.com/find/s/?q=${encodeURIComponent(name)}`
);

export const vividseatsAdapter = createMockAdapter(
  "vividseats",
  "Vivid Seats",
  "https://www.vividseats.com",
  0.98,
  (name) => `https://www.vividseats.com/search?searchTerm=${encodeURIComponent(name)}`
);

export const axsAdapter = createMockAdapter(
  "axs",
  "AXS",
  "https://www.axs.com",
  1.02,
  (name) => `https://www.axs.com/search?keyword=${encodeURIComponent(name)}`
);

export const gametimeAdapter = createMockAdapter(
  "gametime",
  "Gametime",
  "https://gametime.co",
  0.95,
  (name) => `https://gametime.co/s?q=${encodeURIComponent(name)}`
);

export const tickpickAdapter = createMockAdapter(
  "tickpick",
  "TickPick",
  "https://www.tickpick.com",
  0.93,
  (name) => `https://www.tickpick.com/buy-tickets/#q=${encodeURIComponent(name)}`
);
