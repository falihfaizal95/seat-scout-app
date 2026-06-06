"use client";
import { formatPrice } from "@/lib/utils";
import type { AggregatedTickets } from "@/types/ticket";

export default function PriceSummaryBar({ data }: { data: AggregatedTickets }) {
  const { lowestPrice, averagePrice, listings } = data;
  if (!lowestPrice || listings.length === 0) return null;

  const highest = Math.max(...listings.map((l) => l.pricePerTicket));
  const range = highest - lowestPrice;
  const avgPct = range > 0 && averagePrice ? ((averagePrice - lowestPrice) / range) * 100 : 50;
  const savings = averagePrice ? Math.round(((averagePrice - lowestPrice) / averagePrice) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[var(--bg-1)] p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wider mb-1">Best price</p>
          <p className="text-2xl font-black text-[var(--brand)]">{formatPrice(lowestPrice)}</p>
        </div>
        {averagePrice && (
          <div>
            <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wider mb-1">Average</p>
            <p className="text-2xl font-black text-white">{formatPrice(averagePrice)}</p>
          </div>
        )}
        <div>
          <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wider mb-1">Highest</p>
          <p className="text-2xl font-black text-white">{formatPrice(highest)}</p>
        </div>
        <div>
          <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wider mb-1">Listings</p>
          <p className="text-2xl font-black text-white">{listings.length}</p>
        </div>
      </div>
      {savings > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-semibold mb-5">
          ❖ Best listing saves {savings}% vs average
        </div>
      )}
      <div className="relative">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-[var(--brand)] via-yellow-400 to-red-500 opacity-60" />
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full bg-[var(--brand)] border-2 border-[var(--bg)] shadow-[0_0_8px_rgba(109,106,232,0.6)]"
          style={{ left: "0%", transform: "translateX(-50%) translateY(-50%)" }}
        />
        {averagePrice && (
          <div
            className="absolute top-1/2 w-3 h-3 rounded-full bg-white/50 border-2 border-white/80"
            style={{ left: `${avgPct}%`, transform: "translateX(-50%) translateY(-50%)" }}
          />
        )}
      </div>
      <div className="flex justify-between mt-4 text-[11px] text-[var(--text-3)]">
        <span>{formatPrice(lowestPrice)}</span>
        <span>{formatPrice(highest)}</span>
      </div>
    </div>
  );
}
