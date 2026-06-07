import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = new URL(req.url).searchParams.get("name") || "San Antonio Spurs New York Knicks";
  const TM_KEY = process.env.TICKETMASTER_API_KEY || "";
  const SG_CLIENT = process.env.SEATGEEK_CLIENT_ID || "";

  const tmSearchUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_KEY}&keyword=${encodeURIComponent(name)}&classificationName=sports&size=3`;
  const sgUrl = `https://api.seatgeek.com/2/events?${SG_CLIENT ? `client_id=${SG_CLIENT}&` : ""}q=${encodeURIComponent(name)}&per_page=3`;

  const [tmRes, sgRes] = await Promise.allSettled([
    fetch(tmSearchUrl, { cache: "no-store" }),
    fetch(sgUrl, { cache: "no-store" }),
  ]);

  const tmData = tmRes.status === "fulfilled" && tmRes.value.ok ? await tmRes.value.json() : { error: "failed" };
  const sgData = sgRes.status === "fulfilled" && sgRes.value.ok ? await sgRes.value.json() : { error: "failed" };

  const tmEvents = (tmData._embedded?.events ?? []).map((e: { id: string; name: string; priceRanges?: unknown[]; url: string }) => ({
    id: e.id, name: e.name, priceRanges: e.priceRanges ?? [], url: e.url,
  }));

  // Try Commerce API for first TM event
  let tmCommerceResult = null;
  if (tmEvents[0]?.id && TM_KEY) {
    const commerceRes = await fetch(`https://app.ticketmaster.com/commerce/v2/events/${tmEvents[0].id}/offers.json?apikey=${TM_KEY}`, { cache: "no-store" });
    tmCommerceResult = { status: commerceRes.status, data: commerceRes.ok ? await commerceRes.json() : null };
  }

  return NextResponse.json({
    env: { hasTMKey: !!TM_KEY, hasSGClient: !!SG_CLIENT },
    keyword: name,
    tm: { events: tmEvents, commerceApiTest: tmCommerceResult },
    sg: {
      events: (sgData.events ?? []).map((e: { id: number; title: string; url: string; stats: unknown }) => ({
        id: e.id, title: e.title, stats: e.stats, url: e.url,
      })),
      error: sgData.error,
    },
  });
}
