import { NextRequest, NextResponse } from "next/server";
import { searchEvents } from "@/lib/aggregator";
import { getOrSet, searchCacheKey } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") || "";
  const sport = searchParams.get("sport") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const city = searchParams.get("city") || undefined;

  if (!query.trim()) {
    return NextResponse.json({ data: [], error: "Query required" }, { status: 400 });
  }

  try {
    const cacheKey = searchCacheKey(query, sport);
    const events = await getOrSet(cacheKey, () =>
      searchEvents({ query, sport, dateFrom, dateTo, city, limit: 24 })
    );

    return NextResponse.json({ data: events });
  } catch (err) {
    console.error("[API] events/search error:", err);
    return NextResponse.json({ error: "Failed to search events" }, { status: 500 });
  }
}
