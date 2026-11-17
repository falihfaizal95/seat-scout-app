import type { Platform } from "@/types/ticket";

/** Every site we compare, in the order they're shown. */
export const PLATFORMS: Platform[] = [
  "ticketmaster", "seatgeek", "stubhub", "vividseats", "tickpick", "gametime", "axs",
];

const HOME: Record<Platform, string> = {
  ticketmaster: "https://www.ticketmaster.com",
  seatgeek:     "https://seatgeek.com",
  stubhub:      "https://www.stubhub.com",
  vividseats:   "https://www.vividseats.com",
  tickpick:     "https://www.tickpick.com",
  gametime:     "https://gametime.co",
  axs:          "https://www.axs.com",
};

const SEARCH: Record<Platform, (q: string) => string> = {
  ticketmaster: (q) => `https://www.ticketmaster.com/search?q=${q}`,
  seatgeek:     (q) => `https://seatgeek.com/search?search=${q}`,
  stubhub:      (q) => `https://www.stubhub.com/search?q=${q}`,
  vividseats:   (q) => `https://www.vividseats.com/search?searchTerm=${q}`,
  tickpick:     (q) => `https://www.tickpick.com/search?q=${q}`,
  gametime:     (q) => `https://gametime.co/search?q=${q}`,
  axs:          (q) => `https://www.axs.com/search?q=${q}`,
};

/** A link to this event's search results on the given site (or its homepage if we have no name). */
export function platformSearchUrl(platform: Platform, eventName?: string): string {
  return eventName ? SEARCH[platform](encodeURIComponent(eventName)) : HOME[platform];
}
