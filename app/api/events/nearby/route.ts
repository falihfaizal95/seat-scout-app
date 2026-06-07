import { NextRequest, NextResponse } from "next/server";
import { buildPrices } from "@/lib/upcomingEvents";
import type { HomepageEvent } from "@/lib/upcomingEvents";

const TM_KEY = process.env.TICKETMASTER_API_KEY || "";
const TM_BASE = "https://app.ticketmaster.com/discovery/v2";

const SPORT_FALLBACK: Record<string, string> = {
  NBA: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80",
  NHL: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
  MLB: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
};
const FALLBACK_BASE: Record<string, number> = { NBA: 145, NHL: 120, MLB: 85 };

function detectSport(name: string): "NBA" | "NHL" | "MLB" {
  const n = name.toLowerCase();
  if (n.includes("basketball") || n.includes("nba")) return "NBA";
  if (n.includes("hockey") || n.includes("nhl")) return "NHL";
  return "MLB";
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "SeatScout/1.0" }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.county || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const city = await reverseGeocode(lat, lng);

  if (!TM_KEY) return NextResponse.json({ events: [], city });

  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + 30);
  const startDT = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const endDT = future.toISOString().replace(/\.\d{3}Z$/, "Z");

  const url = new URL(`${TM_BASE}/events.json`);
  url.searchParams.set("apikey", TM_KEY);
  url.searchParams.set("classificationName", "sports");
  url.searchParams.set("latlong", `${lat},${lng}`);
  url.searchParams.set("radius", "75");
  url.searchParams.set("unit", "miles");
  url.searchParams.set("startDateTime", startDT);
  url.searchParams.set("endDateTime", endDT);
  url.searchParams.set("sort", "date,asc");
  url.searchParams.set("size", "10");

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ events: [], city });

    const data = await res.json();
    const tmEvents: {
      id: string;
      name: string;
      dates: { start: { dateTime?: string; localDate: string } };
      images?: { url: string; width: number; height: number }[];
      priceRanges?: { min: number }[];
      url?: string;
      _embedded?: { venues?: { name: string; city?: { name: string }; state?: { stateCode: string } }[] };
      classifications?: { genre?: { name: string } }[];
    }[] = data._embedded?.events ?? [];

    const events: HomepageEvent[] = tmEvents.slice(0, 3).map((ev) => {
      const venue = ev._embedded?.venues?.[0];
      const isoDate = ev.dates.start.dateTime ?? `${ev.dates.start.localDate}T19:00:00Z`;
      const bestImg = [...(ev.images ?? [])].sort((a, b) => b.width * b.height - a.width * a.height)[0];
      const genre = ev.classifications?.[0]?.genre?.name ?? "";
      const sport = detectSport(genre);
      const base = ev.priceRanges?.[0]?.min ?? FALLBACK_BASE[sport];
      const location = [venue?.name, venue?.city?.name, venue?.state?.stateCode].filter(Boolean).join(", ");
      return {
        id: `tm_${ev.id}`,
        title: ev.name,
        isoDate,
        location: location || "TBD",
        imageUrl: bestImg?.url ?? SPORT_FALLBACK[sport],
        sport,
        tmUrl: ev.url,
        prices: buildPrices(base, ev.id),
      };
    });

    return NextResponse.json({ events, city });
  } catch {
    return NextResponse.json({ events: [], city });
  }
}
