import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import LocalEventDate from "@/components/ui/LocalEventDate";
import EventImage from "@/components/events/EventImage";
import type { HomepageEvent } from "@/lib/upcomingEvents";

interface Props {
  event: HomepageEvent;
}

const SPORT_STYLE: Record<string, { emoji: string; color: string; label?: string }> = {
  NBA: { emoji: "🏀", color: "#f97316" },
  NHL: { emoji: "🏒", color: "#06b6d4" },
  NFL: { emoji: "🏈", color: "#ef4444" },
  MLB: { emoji: "⚾", color: "#3b82f6" },
  MLS: { emoji: "⚽", color: "#22c55e", label: "Soccer" },
};

export default function HomepageEventCard({ event }: Props) {
  const style = SPORT_STYLE[event.sport] ?? { emoji: "🎟️", color: "#7c6cff" };

  const params = new URLSearchParams({
    title: event.title,
    date: event.isoDate,
    location: event.location,
    sport: event.sport,
  });
  if (event.imageUrl) params.set("image", event.imageUrl);
  if (event.tmUrl) params.set("tmUrl", event.tmUrl);
  const eventUrl = `/event/${event.id}?${params.toString()}`;

  return (
    <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] transition-all duration-200 md:hover:-translate-y-1 md:hover:border-[rgba(124,106,247,0.25)]">

      {/* Picture: both teams' logos for games, never a stock photo */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
        <EventImage
          src={event.imageUrl}
          alt={event.title}
          teams={event.teams}
          emoji={style.emoji}
          accent={style.color}
        />
        <div
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-[700]"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", border: `1px solid ${style.color}55`, color: style.color }}
        >
          <span>{style.emoji}</span>
          <span>{style.label ?? event.sport}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 sm:px-5">
        <h3 className="font-syne mb-3 text-[18px] font-[800] leading-[1.25] tracking-[-0.3px] text-[var(--text-1)] sm:min-h-[48px] sm:text-[19px]">
          {event.title}
        </h3>

        <div className="mb-4 flex flex-col gap-[6px] text-[13px] text-[var(--text-2)]">
          <div className="flex min-w-0 items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            <LocalEventDate isoDate={event.isoDate} />
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Only real information: Ticketmaster's own minimum when it gives one */}
        <div className="rounded-[10px] border border-white/[0.07] bg-white/[0.04] px-4 py-3">
          <div className="mb-1 text-[11px] font-[700] uppercase tracking-[0.06em] text-[var(--text-3)]">
            {event.lowestPrice != null ? "Ticketmaster from" : "Compare prices on"}
          </div>
          <div className="font-syne text-[14px] font-[700] leading-snug text-[var(--text-1)]">
            {event.lowestPrice != null
              ? `$${Math.round(event.lowestPrice)}`
              : "Ticketmaster, SeatGeek, StubHub, Vivid Seats & more"}
          </div>
        </div>

        <div className="flex-1" />
      </div>

      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <Link
          href={eventUrl}
          className="font-syne flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-[700] text-white transition-all hover:opacity-90 hover:shadow-[0_6px_20px_rgba(34,197,94,0.35)]"
          style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
        >
          Compare Prices
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
