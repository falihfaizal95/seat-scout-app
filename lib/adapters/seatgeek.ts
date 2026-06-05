import type { TicketAdapter, NormalizedEvent, EventSearchParams, TicketListing } from "./types";
import { generateEventId } from "@/lib/utils";

const BASE_URL = "https://api.seatgeek.com/2";
const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID || "";

interface SGPerformer { name: string; image?: string }
interface SGVenue { name: string; city: string; state: string; country: string }
interface SGEvent {
  id: number; title: string; type: string; datetime_utc: string;
  performers: SGPerformer[]; venue: SGVenue;
  stats: { lowest_price?: number; average_price?: number };
  url: string; taxonomies?: Array<{ name: string }>;
}

function mapSGSport(event: SGEvent): string {
  const t = event.taxonomies?.map((x) => x.name.toLowerCase()) || [];
  if (t.some((x) => x.includes("nfl") || x.includes("football"))) return "NFL";
  if (t.some((x) => x.includes("nba") || x.includes("basketball"))) return "NBA";
  if (t.some((x) => x.includes("mlb") || x.includes("baseball"))) return "MLB";
  if (t.some((x) => x.includes("nhl") || x.includes("hockey"))) return "NHL";
  if (t.some((x) => x.includes("mls") || x.includes("soccer"))) return "MLS";
  return "Other";
}

export const seatgeekAdapter: TicketAdapter = {
  platform: "seatgeek",

  async searchEvents(params: EventSearchParams): Promise<NormalizedEvent[]> {
    if (!CLIENT_ID) { console.warn("[SeatGeek] No client ID"); return []; }
    const url = new URL(`${BASE_URL}/events`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("q", params.query);
    url.searchParams.set("type", "sports");
    url.searchParams.set("per_page", String(params.limit || 20));
    if (params.dateFrom) url.searchParams.set("datetime_utc.gte", `${params.dateFrom}T00:00:00`);
    if (params.dateTo)   url.searchParams.set("datetime_utc.lte", `${params.dateTo}T23:59:59`);
    try {
      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`SG API error: ${res.status}`);
      const data = await res.json();
      const events: SGEvent[] = data.events || [];
      return events.map((e) => ({
        id: generateEventId("sg", String(e.id)),
        name: e.title,
        sport: mapSGSport(e),
        homeTeam: e.performers[0]?.name,
        awayTeam: e.performers[1]?.name,
        homeTeamLogo: e.performers[0]?.image,
        awayTeamLogo: e.performers[1]?.image,
        venue: e.venue.name,
        city: e.venue.city,
        state: e.venue.state,
        country: e.venue.country || "US",
        eventDate: e.datetime_utc,
        lowestPrice: e.stats.lowest_price,
        averagePrice: e.stats.average_price,
        url: e.url,
        source: "seatgeek",
        externalIds: { seatgeek: String(e.id) },
      }));
    } catch (err) {
      console.error("[SeatGeek] searchEvents error:", err);
      return [];
    }
  },

  async getTickets(externalEventId: string): Promise<TicketListing[]> {
    if (!CLIENT_ID) return [];
    const url = new URL(`${BASE_URL}/listings`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("event_id", externalEventId);
    url.searchParams.set("per_page", "50");
    try {
      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (!res.ok) {
        const eventUrl = new URL(`${BASE_URL}/events/${externalEventId}`);
        eventUrl.searchParams.set("client_id", CLIENT_ID);
        const eventRes = await fetch(eventUrl.toString(), { next: { revalidate: 300 } });
        if (!eventRes.ok) return [];
        const e: SGEvent = await eventRes.json();
        if (!e.stats.lowest_price) return [];
        return [{ id: `sg_${externalEventId}_0`, platform: "seatgeek" as const, eventId: generateEventId("sg", externalEventId), externalEventId, section: "Various", row: null, quantity: 2, pricePerTicket: e.stats.lowest_price, totalPrice: e.stats.lowest_price * 2, currency: "USD", buyUrl: e.url, listingFetchedAt: new Date(), isVerified: true, isMock: false }];
      }
      const data = await res.json();
      return (data.listings || []).slice(0, 30).map(
        (l: { id: number; section: string; row?: string; quantity: number; price: { amount: number } }, i: number) => ({
          id: `sg_${externalEventId}_${i}`,
          platform: "seatgeek" as const,
          eventId: generateEventId("sg", externalEventId),
          externalEventId,
          section: l.section || "General",
          row: l.row || null,
          quantity: l.quantity || 2,
          pricePerTicket: l.price?.amount || 0,
          totalPrice: (l.price?.amount || 0) * (l.quantity || 2),
          currency: "USD",
          buyUrl: `https://seatgeek.com/e/${externalEventId}`,
          listingFetchedAt: new Date(),
          isVerified: true,
          isMock: false,
        })
      );
    } catch (err) {
      console.error("[SeatGeek] getTickets error:", err);
      return [];
    }
  },
};
