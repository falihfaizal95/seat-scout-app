import { NextRequest, NextResponse } from "next/server";
import { aggregateTickets } from "@/lib/aggregator";
import { getOrSet, ticketCacheKey } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  if (!eventId) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 });
  }

  try {
    const cacheKey = ticketCacheKey(eventId);
    const tickets = await getOrSet(cacheKey, () => aggregateTickets(eventId));

    return NextResponse.json({ data: tickets });
  } catch (err) {
    console.error("[API] tickets error:", err);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
