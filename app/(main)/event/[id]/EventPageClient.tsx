"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react";
import LocalEventDate from "@/components/ui/LocalEventDate";

interface PlatformPrice {
  platform: string;
  price: number;
  buyUrl?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Ticketmaster: "#026CDF",
  StubHub: "#FF5C00",
  SeatGeek: "#05C053",
  "Vivid Seats": "#6B21A8",
  AXS: "#E31837",
  Gametime: "#FF6B00",
  TickPick: "#1DB5BE",
};

export default function EventPageClient() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();

  const title = sp.get("title") ?? "Event";
  const isoDate = sp.get("date") ?? "";
  const location = sp.get("location") ?? "";
  const imageUrl = sp.get("image") ?? "";
  const sport = sp.get("sport") ?? "";
  const tmUrl = sp.get("tmUrl") ?? "";

  const [prices, setPrices] = useState<PlatformPrice[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`);
        if (res.ok) {
          const json = await res.json();
          const listings: { platform: string; pricePerTicket: number; buyUrl: string }[] =
            json.data?.listings ?? [];
          const byPlatform: Record<string, { price: number; buyUrl: string }> = {};
          for (const l of listings) {
            const name = l.platform;
            if (!byPlatform[name] || l.pricePerTicket < byPlatform[name].price) {
              byPlatform[name] = { price: l.pricePerTicket, buyUrl: l.buyUrl };
            }
          }
          const result = Object.entries(byPlatform)
            .map(([platform, { price, buyUrl }]) => ({ platform, price, buyUrl }))
            .sort((a, b) => a.price - b.price);
          setPrices(result);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const sportEmoji: Record<string, string> = { NBA: "🏀", NHL: "🏒", MLB: "⚾" };
  const emoji = sportEmoji[sport] ?? "🎟️";

  const lowestPrice = prices && prices.length > 0 ? prices[0].price : null;
  const highestPrice = prices && prices.length > 0 ? prices[prices.length - 1].price : null;
  const savings = lowestPrice && highestPrice ? highestPrice - lowestPrice : null;

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
        >
          <ArrowLeft size={14} /> Back to events
        </Link>

        <div className="relative mb-8 overflow-hidden rounded-[24px] border border-[var(--card-border)] bg-[var(--card)]">
          {imageUrl && (
            <div className="h-[220px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover brightness-[0.7]"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
            </div>
          )}
          <div className="px-6 pb-6 pt-4">
            {sport && (
              <span className="mb-3 inline-block rounded-[6px] border border-[rgba(124,106,247,0.3)] bg-[rgba(124,106,247,0.1)] px-[10px] py-[3px] text-[12px] font-[700] text-[var(--brand-light)]">
                {emoji} {sport}
              </span>
            )}
            <h1 className="font-syne mb-4 text-[24px] font-[800] leading-tight tracking-[-0.4px] text-[var(--text-1)]">
              {title}
            </h1>
            <div className="flex flex-col gap-2 text-[13px] text-[var(--text-2)]">
              {isoDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="shrink-0" />
                  <LocalEventDate isoDate={isoDate} />
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {savings && savings > 0 && (
          <div className="mb-6 rounded-[14px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.07)] px-5 py-4">
            <p className="text-[14px] font-[700] text-[var(--green)]">
              💰 Save up to ${savings} by choosing the right platform
            </p>
            <p className="mt-1 text-[12px] text-[var(--text-3)]">
              Prices range from ${lowestPrice} to ${highestPrice} across platforms
            </p>
          </div>
        )}

        <div className="rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] overflow-hidden">
          <div className="border-b border-[var(--card-border)] px-6 py-4">
            <h2 className="font-syne text-[16px] font-[800] text-[var(--text-1)]">
              Price Comparison
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--text-3)]">Best available price per platform</p>
          </div>

          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[56px] rounded-[12px] shimmer" />
              ))}
            </div>
          ) : prices && prices.length > 0 ? (
            <div className="p-4 flex flex-col gap-3">
              {prices.map((p, idx) => {
                const isBest = idx === 0;
                const color = PLATFORM_COLORS[p.platform] ?? "#7C6AF7";
                return (
                  <a
                    key={p.platform}
                    href={p.buyUrl || tmUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-[12px] px-5 py-[14px] transition-all hover:opacity-90"
                    style={{
                      background: isBest ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                      border: isBest
                        ? "1.5px solid rgba(34,197,94,0.45)"
                        : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="font-syne text-[14px] font-[700]"
                        style={{ color: isBest ? "var(--green)" : "var(--text-1)" }}
                      >
                        {p.platform}
                      </span>
                      {isBest && (
                        <span className="rounded-full bg-[var(--green)] px-[7px] py-[2px] text-[10px] font-[800] uppercase tracking-[0.5px] text-white">
                          BEST
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-syne text-[16px] font-[800] tabular-nums"
                        style={{ color: isBest ? "var(--green)" : "var(--text-1)" }}
                      >
                        ${p.price}
                      </span>
                      <ExternalLink size={13} className="text-[var(--text-3)]" />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-[14px] text-[var(--text-3)]">
              No ticket listings found for this event.
              {tmUrl && (
                <>
                  {" "}
                  <a href={tmUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-light)] underline">
                    Check Ticketmaster
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        {tmUrl && (
          <a
            href={tmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-syne mt-6 flex w-full items-center justify-center gap-2 rounded-[14px] py-[16px] text-[15px] font-[700] text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
          >
            Buy on Ticketmaster
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
