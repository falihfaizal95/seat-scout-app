import { NextRequest, NextResponse } from "next/server";
import type { HomepageEvent } from "@/lib/upcomingEvents";
import { buildPrices } from "@/lib/upcomingEvents";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const TM_KEY = process.env.TICKETMASTER_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (!lat || !lng) return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  if (!TM_KEY) return NextResponse.json({ events: [], city: null });

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Reverse-geocode for city name
  let city: string | null = null;
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "SeatScout/1.0" }, cache: "no-store" }
    );
    if (geoRes.ok) {
      const d = await geoRes.json();
      city = d.address?.city || d.address?.town || d.address?.county || null;
    }
  } catch { /* city stays null */ }

  // Query Ticketmaster by lat/lng — sports events in next 30 days, sorted by date
  const url = new URL(`${TM_BASE}/events.json`);
  url.searchParams.set("apikey", TM_KEY);
  url.searchParams.set("latlong", `${lat},${lng}`);
  url.searchParams.set("radius", "75");
  url.searchParams.set("unit", "miles");
  url.searchParams.set("classificationName", "sports");
  url.searchParams.set("startDateTime", now.toISOString().slice(0, 19) + "Z");
  url.searchParams.set("endDateTime", in30Days.toISOString().slice(0, 19) + "Z");
  url.searchParams.set("size", "10");
  url.searchParams.set("sort", "date,asc"); // closest date first

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ events: [], city });
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tmEvents: any[] = data._embedded?.events ?? [];

    const events: HomepageEvent[] = tmEvents.slice(0, 3).map((ev) => {
      const venue = ev._embedded?.venues?.[0];
      const location = [venue?.name, venue?.city?.name, venue?.state?.stateCode]
        .filter(Boolean).join(", ");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bestImage = [...((ev.images ?? []) as any[])]
        .sort((a, b) => b.width * b.height - a.width * a.height)[0];
      const base: number = ev.priceRanges?.[0]?.min ?? 75;
      return {
        id: `tm_nearby_${ev.id}`,
        title: ev.name,
        isoDate: ev.dates?.start?.dateTime ?? (ev.dates?.start?.localDate + "T00:00:00Z"),
        location: location || "TBD",
        imageUrl: bestImage?.url ?? "",
        sport: "NBA" as const,
        tmUrl: ev.url,
        prices: buildPrices(base, ev.id),
      };
    });

    return NextResponse.json({ events, city });
  } catch {
    return NextResponse.json({ events: [], city });
  }
}
