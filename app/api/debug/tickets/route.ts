import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const SG_CLIENT = process.env.SEATGEEK_CLIENT_ID || "";
  const sgEventId = 18068093; // NBA Finals Game 3: Spurs at Knicks

  async function sgFetch(path: string, params: Record<string, string>) {
    const url = new URL(`https://api.seatgeek.com/2/${path}`);
    if (SG_CLIENT) url.searchParams.set("client_id", SG_CLIENT);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { cache: "no-store" });
    return { status: res.status, data: res.ok ? await res.json() : null };
  }

  const [listingsResult, eventResult] = await Promise.all([
    sgFetch("listings", { event_id: String(sgEventId), per_page: "5" }),
    sgFetch(`events/${sgEventId}`, {}),
  ]);

  return NextResponse.json({
    sgEventId,
    listings: {
      status: listingsResult.status,
      count: listingsResult.data?.listings?.length ?? 0,
      sample: listingsResult.data?.listings?.slice(0, 3) ?? [],
    },
    eventStats: {
      status: eventResult.status,
      stats: eventResult.data?.stats ?? null,
    },
  });
}
