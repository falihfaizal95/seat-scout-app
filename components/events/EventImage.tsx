"use client";
import { useState } from "react";
import type { TeamBadge } from "@/lib/teamLogos";

interface Props {
  /** A photo of this specific event. Never pass a generic stock photo here. */
  src?: string;
  alt: string;
  teams?: { home: TeamBadge; away: TeamBadge };
  emoji: string;
  accent: string;
}

/**
 * Team games always show the two teams' logos on their team colours, so the
 * picture always matches the teams named on the card. Other events show their
 * own photo, or a plain sport panel if there isn't one. Never a stock photo.
 */
export default function EventImage({ src, alt, teams, emoji, accent }: Props) {
  const [failed, setFailed] = useState(false);

  if (teams && teams.home.logo && teams.away.logo) {
    const away = `#${teams.away.color || "2a2840"}`;
    const home = `#${teams.home.color || "2a2840"}`;
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full items-center justify-center gap-[6%]"
        style={{ background: `linear-gradient(115deg, ${away} 0%, ${away} 48%, ${home} 52%, ${home} 100%)` }}
      >
        {[teams.away, teams.home].map((t, i) => (
          <div key={t.name} className="contents">
            {i === 1 && <span className="font-syne text-[18px] font-[800] text-white drop-shadow">@</span>}
            <div className="flex aspect-square h-[55%] max-h-[100px] items-center justify-center rounded-full bg-white/90 p-[10%] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.logo} alt={t.name} className="h-full w-full object-contain" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover brightness-[0.85] transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="flex h-full w-full items-center justify-center text-[64px]"
      style={{ background: `radial-gradient(circle at 50% 40%, ${accent}55 0%, #13121f 75%)` }}
    >
      {emoji}
    </div>
  );
}
