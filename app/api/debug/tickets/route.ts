import { NextResponse } from "next/server";

const SG_BASE = "https://api.seatgeek.com/2";

export async function GET() {
  const SG_CLIENT = process.env.SEATGEEK_CLIENT_ID || "";

  async function sgSearch(q: string) {
    const url = new URL(`${SG_BASE}/events`);
    if (SG_CLIENT) url.searchParams.set("client_id", SG_CLIENT);
    url.searchParams.set("q", q);
    url.searchParams.set("per_page", "2");
    const res = await fetch(url.toString(), { cache: "no-store" });
    const d = res.ok ? await res.json() : {};
    return (d.events ?? []).map((e: { id: number; title: string; stats: unknown }) => ({
      id: e.id, title: e.title, stats: e.stats,
    }));
  }

  async function sgListings(eventId: number) {
    const url = new URL(`${SG_BASE}/listings`);
    if (SG_CLIENT) url.searchParams.set("client_id", SG_CLIENT);
    url.searchParams.set("event_id", String(eventId));
    url.searchParams.set("per_page", "3");
    const res = await fetch(url.toString(), { cache: "no-store" });
    return { status: res.status, count: res.ok ? (await res.json()).listings?.length ?? 0 : 0 };
  }

  async function sgEventStats(eventId: number) {
    const url = new URL(`${SG_BASE}/events/${eventId}`);
    if (SG_CLIENT) url.searchParams.set("client_id", SG_CLIENT);
    const res = await fetch(url.toString(), { cache: "no-store" });
    const d = res.ok ? await res.json() : {};
    return { status: res.status, stats: d.stats ?? {} };
  }

  // Search for a few regular-season games across sports
  const [mlbEvents, nhlEvents, nbaEvents] = await Promise.all([
    sgSearch("Yankees"),
    sgSearch("Oilers"),
    sgSearch("Celtics"),
  ]);

  // For each, test both listings and stats endpoints
  const tests = await Promise.all(
    [...mlbEvents, ...nhlEvents, ...nbaEvents].slice(0, 4).map(async (ev: { id: number; title: string; stats: unknown }) => {
      const [listings, stats] = await Promise.all([sgListings(ev.id), sgEventStats(ev.id)]);
      return { id: ev.id, title: ev.title, searchStats: ev.stats, listings, eventStats: stats };
    })
  );

  return NextResponse.json({ tests });
}
