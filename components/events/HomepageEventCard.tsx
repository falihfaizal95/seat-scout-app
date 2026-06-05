import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import LocalEventDate from "@/components/ui/LocalEventDate";
import type { HomepageEvent } from "@/lib/upcomingEvents";

interface Props {
  event: HomepageEvent;
}

export default function HomepageEventCard({ event }: Props) {
  const lowestPrice  = Math.min(...event.prices.map((p) => p.price));
  const highestPrice = Math.max(...event.prices.map((p) => p.price));
  const savings      = highestPrice - lowestPrice;

  return (
    <div className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(124,106,247,0.25)]">

      <div className="h-[200px] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover brightness-[0.85] transition-transform duration-500 group-hover:scale-105"
          crossOrigin="anonymous"
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4">

        <span className="mb-3 inline-block self-start rounded-[6px] border border-[rgba(34,197,94,0.2)] bg-[var(--green-dim)] px-[10px] py-[3px] text-[12px] font-[700] text-[var(--green)]">
          Save ${savings}
        </span>

        <h3 className="font-syne mb-3 min-h-[52px] text-[19px] font-[800] leading-[1.3] tracking-[-0.3px] text-[var(--text-1)]">
          {event.title}
        </h3>

        <div className="mb-4 flex flex-col gap-[5px] text-[13px] text-[var(--text-2)]">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            <LocalEventDate isoDate={event.isoDate} />
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between px-[2px] text-[11px] font-[700] uppercase tracking-[0.06em] text-[var(--text-3)]">
          <span>Platform</span>
          <span>Price</span>
        </div>

        <div className="flex flex-col gap-[6px]">
          {event.prices.map((p) => {
            const isBest = p.price === lowestPrice;
            return (
              <div
                key={p.platform}
                className="flex items-center justify-between rounded-[10px] px-4 py-[10px]"
                style={{
                  background: isBest ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                  border: isBest ? "1.5px solid rgba(34,197,94,0.45)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span className="flex items-center gap-2">
                  <span className={`font-syne text-[13.5px] font-[700] ${isBest ? "text-[var(--green)]" : "text-[var(--text-1)]"}`}>
                    {p.platform}
                  </span>
                  {isBest && (
                    <span className="rounded-full bg-[var(--green)] px-[7px] py-[2px] text-[10px] font-[800] uppercase tracking-[0.5px] text-white">
                      BEST
                    </span>
                  )}
                </span>
                <span className={`font-syne text-[14px] font-[800] tabular-nums ${isBest ? "text-[var(--green)]" : "text-[var(--text-1)]"}`}>
                  ${p.price}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex-1" />
      </div>

      <div className="px-5 pb-5 pt-4">
        {event.tmUrl ? (
          <a
            href={event.tmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-syne flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-[700] text-white transition-all hover:opacity-90 hover:shadow-[0_6px_20px_rgba(34,197,94,0.35)]"
            style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
          >
            View Best Deal
            <ExternalLink size={15} />
          </a>
        ) : (
          <Link
            href={`/event/${event.id}`}
            className="font-syne flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-[700] text-white transition-all hover:opacity-90 hover:shadow-[0_6px_20px_rgba(34,197,94,0.35)]"
            style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
          >
            View Best Deal
            <ExternalLink size={15} />
          </Link>
        )}
      </div>

    </div>
  );
}
