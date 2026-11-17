"use client";
import { useState, useEffect } from "react";

const PHRASES = [
  "Compare ticket sites in one search",
  "Like Kayak, but for sports tickets",
  "Stop overpaying — find the best seat deal",
  "Ticketmaster, StubHub, SeatGeek — all in one place",
  "Never get ripped off on tickets again",
];

export default function RotatingBadge() {
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex max-w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(124,106,247,0.3)] bg-[var(--brand-dim)] px-4 py-2 text-[13px] font-[600] tracking-[0.2px] text-[var(--brand-light)] sm:min-w-[400px] sm:gap-3 sm:px-6 sm:py-[10px] sm:text-[15px]">
      <span className="size-[9px] shrink-0 rounded-full bg-[var(--brand-light)]" />
      <span
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
          display: "inline-block",
        }}
      >
        {PHRASES[index]}
      </span>
    </div>
  );
}
