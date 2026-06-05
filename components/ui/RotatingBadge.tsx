"use client";
import { useState, useEffect } from "react";

const PHRASES = [
  "Compare prices across 4+ platforms instantly",
  "Like Kayak, but for sports tickets",
  "Stop overpaying — find the best seat deal",
  "Ticketmaster, StubHub, SeatGeek — all in one place",
  "Save an average of $47 per ticket",
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
    <div className="mb-9 inline-flex max-w-full items-center gap-3 rounded-full border border-[rgba(124,106,247,0.3)] bg-[var(--brand-dim)] px-6 py-[10px] text-[15px] font-[600] tracking-[0.3px] text-[var(--brand-light)]" style={{ minWidth: "400px", justifyContent: "center" }}>
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
