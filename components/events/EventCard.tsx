"use client";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import type { NormalizedEvent } from "@/types/event";

interface EventCardProps {
  event: NormalizedEvent;
  index?: number;
}

function segmentBadgeClass(segment?: string): string {
  switch (segment) {
    case "Sports":         return "border-[rgba(124,106,247,0.35)] bg-[rgba(124,106,247,0.15)] text-[var(--brand-light)]";
    case "Music":          return "border-[rgba(59,130,246,0.35)]  bg-[rgba(59,130,246,0.15)]  text-blue-400";
    case "Arts & Theatre": return "border-[rgba(234,179,8,0.35)]   bg-[rgba(234,179,8,0.15)]   text-yellow-400";
    case "Comedy":         return "border-[rgba(249,115,22,0.35)]  bg-[rgba(249,115,22,0.15)]  text-orange-400";
    default:               return "border-white/[0.12] bg-white/[0.06] text-[var(--text-2)]";
  }
}

function segmentEmoji(segment?: string, sport?: string): string {
  if (segment === "Music")          return "🎵";
  if (segment === "Arts & Theatre") return "🎤";
  if (segment === "Comedy")         return "😂";
  const sportEmojis: Record<string, string> = { NFL: "🏈", NBA: "🏀", MLB: "⚾", NHL: "🏒", MLS: "⚽", NCAAF: "🏈", NCAAB: "🏀", UFC: "🥊", Boxing: "🥊", Tennis: "🎾", Golf: "⛳" };
  return sportEmojis[sport ?? ""] ?? "🎟️";
}

export default function EventCard({ event }: EventCardProps) {
  const emoji = segmentEmoji(event.segment, event.sport as string);
  const hasTeams = event.homeTeam && event.awayTeam;
  const badgeClass = segmentBadgeClass(event.segment);
  const badgeLabel = event.sport || event.segment || "Event";

  return (
    <Link href={`/event/${event.id}`} className="group block">
      <div className="rounded-2xl border border-white/[0.07] bg-[var(--bg-1)] overflow-hidden transition-all duration-300 hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg-3)]">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">{emoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-1)] via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm text-[11px] font-semibold ${badgeClass}`}>
              {emoji} {badgeLabel}
            </span>
          </div>
          {event.lowestPrice && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[var(--green-dim)] border border-[rgba(34,197,94,0.3)] text-[var(--green)] text-xs font-bold">
                From {formatPrice(event.lowestPrice)}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          {hasTeams ? (
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-semibold text-sm text-white truncate">{event.awayTeam}</span>
              <span className="text-[10px] font-bold text-[var(--text-3)] mx-2 flex-shrink-0 uppercase tracking-wider">vs</span>
              <span className="font-semibold text-sm text-white truncate text-right">{event.homeTeam}</span>
            </div>
          ) : (
            <h3 className="font-semibold text-sm text-white mb-2.5 line-clamp-2 leading-snug">{event.name}</h3>
          )}
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
              <Calendar size={11} />
              <span>{formatDate(event.eventDate)} · {formatTime(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
              <MapPin size={11} />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-3)]">Ticketmaster</span>
            <span className="text-[11px] font-semibold text-[var(--brand-light)] group-hover:translate-x-0.5 transition-transform">View Deals →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
