import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = new URL(req.url).searchParams.get("name") || "San Antonio Spurs New York Knicks";
  const TM_KEY = process.env.TICKETMASTER_API_KEY || "";
  const SG_CLIENT = process.env.SEATGEEK_CLIENT_ID || "";

  async function sgSearch(q: string) {
    const url = new URL("https://api.seatgeek.com/2/events");
    if (SG_CLIENT) url.searchParams.set("client_id", SG_CLIENT);
    url.searchParams.set("q", q);
    url.searchParams.set("per_page", "3");
    try {
      const res = await fetch(url.toString(), { cache: "no-store" });
      const d = res.ok ? await res.json() : { error: res.status };
      return {
        q, status: res.status,
        events: (d.events ?? []).map((e: { id: number; title: string; stats: unknown; url: string }) => ({
          id: e.id, title: e.title, stats: e.stats, url: e.url,
        })),
        error: d.error,
      };
    } catch (err) { return { q, error: String(err) }; }
  }

  const [sgFull, sgKnicks, sgNBAFinals, sgBasketball] = await Promise.all([
    sgSearch(name),
    sgSearch("Knicks"),
    sgSearch("NBA Finals"),
    sgSearch("basketball"),
  ]);

  return NextResponse.json({
    env: { hasTMKey: !!TM_KEY, hasSGClient: !!SG_CLIENT, sgClientPreview: SG_CLIENT.slice(0, 6) + "..." },
    seatgeekTests: { sgFull, sgKnicks, sgNBAFinals, sgBasketball },
  });
}
