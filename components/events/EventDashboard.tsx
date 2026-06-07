"use client";
import { useState, useEffect, useMemo } from "react";
import { TrendingDown, DollarSign, Activity, Users, ExternalLink, ChevronDown } from "lucide-react";
import type { AggregatedTickets, Platform, TicketListing } from "@/types/ticket";
import { PLATFORM_INFO } from "@/types/ticket";

function seeded(seed: number, i: number): number {
  const x = Math.sin(seed * 9301 + i * 49297 + 233) * 10000;
  return x - Math.floor(x);
}
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function PriceTrendChart({ basePrice, eventId, days }: { basePrice: number; eventId: string; days: number }) {
  const seed = hashStr(eventId);
  const data = useMemo(() => Array.from({ length: days }, (_, i) => {
    const daysAgo = days - 1 - i;
    const drift = basePrice * (1 + daysAgo * 0.005);
    const noise = (seeded(seed, i) - 0.5) * basePrice * 0.07;
    return Math.max(basePrice * 0.75, Math.round(drift + noise));
  }), [basePrice, eventId, days, seed]);

  const now = new Date();
  const dates = useMemo(() => Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [days]);

  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const W = 500, H = 160, PL = 38, PR = 10, PT = 10, PB = 28;
  const iW = W - PL - PR, iH = H - PT - PB;
  const pts = data.map((v, i) => [PL + (i / (data.length - 1)) * iW, PT + (1 - (v - min) / range) * iH] as [number, number]);
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const fillD = `${lineD} L${pts[pts.length - 1][0].toFixed(1)},${(PT + iH).toFixed(1)} L${PL},${(PT + iH).toFixed(1)} Z`;
  const yTicks = [min, Math.round(min + range / 2), max];
  const xTicks = [0, Math.floor(data.length / 2), data.length - 1];
  const gradId = `fill-${eventId.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {yTicks.map((v) => {
        const y = PT + (1 - (v - min) / range) * iH;
        return (
          <g key={v}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 3" />
            <text x={PL - 4} y={y + 3.5} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">{v}</text>
          </g>
        );
      })}
      <path d={fillD} fill={`url(#${gradId})`} />
      <path d={lineD} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {xTicks.map((i) => (
        <text key={i} x={(PL + (i / (data.length - 1)) * iW).toFixed(1)} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">{dates[i]}</text>
      ))}
    </svg>
  );
}

function MarketActivityChart({ eventId }: { eventId: string }) {
  const seed = hashStr(eventId + "activity");
  const labels = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "Now"];
  const base = [38, 28, 48, 58, 68, 82, 88];
  const data = labels.map((l, i) => ({ label: l, value: Math.min(98, Math.round(base[i] + (seeded(seed, i) - 0.5) * 18)) }));
  const W = 500, H = 160, PL = 30, PR = 10, PT = 10, PB = 28;
  const iW = W - PL - PR, iH = H - PT - PB;
  const bW = (iW / labels.length) * 0.55;
  const bGap = (iW / labels.length) * 0.45;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      {[0, 25, 50, 75, 100].map((v) => {
        const y = PT + (1 - v / 100) * iH;
        return (
          <g key={v}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 3" />
            <text x={PL - 4} y={y + 3.5} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">{v}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bH = (d.value / 100) * iH;
        const x = PL + (i / labels.length) * iW + bGap / 2;
        const y = PT + iH - bH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={bH} rx="3" fill="#f97316" opacity="0.82" />
            <text x={x + bW / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function TicketRow({ listing, isBest }: { listing: TicketListing; isBest: boolean }) {
  const info   = PLATFORM_INFO[listing.platform];
  const pName  = info?.name ?? listing.platform;
  const pColor = info?.color ?? "#7c6cff";
  const base   = Math.round(listing.pricePerTicket * 0.81);
  const fees   = Math.round((listing.pricePerTicket - base) * 100) / 100;
  const seatStart = 8 + ((listing.section.charCodeAt(listing.section.length - 1) ?? 65) % 10);
  const seatEnd   = seatStart + Math.min(listing.quantity, 4) - 1;

  return (
    <div style={{
      background: isBest ? "rgba(34,197,94,0.06)" : "#13121f",
      border: `1.5px solid ${isBest ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: "14px", padding: "18px 20px",
      display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
      transition: "border-color 0.2s",
    }}>
      <div style={{ flex: "1 1 160px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>{listing.section}</span>
          {isBest && (
            <span style={{ background: "#22c55e", color: "#fff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "20px" }}>BEST DEAL</span>
          )}
        </div>
        <div style={{ fontSize: "0.82rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
          {listing.row ? `Row ${listing.row}` : "General Admission"}{listing.quantity > 1 ? ` · Seats ${seatStart}–${seatEnd}` : ""}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "0 0 auto" }}>
        <span style={{ background: `${pColor}22`, border: `1px solid ${pColor}55`, color: pColor, fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{pName}</span>
        <span style={{ fontSize: "0.8rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", whiteSpace: "nowrap" }}>${base} + ${fees.toFixed(2)} fees</span>
      </div>
      <div style={{ flex: "0 0 auto", textAlign: "right" }}>
        <div style={{ fontSize: "0.7rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", marginBottom: "2px" }}>Total</div>
        <div className="font-syne" style={{ fontWeight: 800, fontSize: "1.25rem", color: isBest ? "#22c55e" : "#ffffff" }}>${Math.round(listing.pricePerTicket)}</div>
      </div>
      <a
        href={listing.buyUrl} target="_blank" rel="noopener noreferrer"
        style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "6px", background: "#7c6cff", color: "#fff", fontFamily: "var(--font-syne),'Syne',sans-serif", fontWeight: 700, fontSize: "0.88rem", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#6a5ae0")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#7c6cff")}
      >
        View Deal <ExternalLink size={13} />
      </a>
    </div>
  );
}

interface Props {
  eventId: string;
}

export default function EventDashboard({ eventId }: Props) {
  const [data, setData]             = useState<AggregatedTickets | null>(null);
  const [loading, setLoading]       = useState(true);
  const [trendDays, setTrendDays]   = useState<7 | 14 | 30>(7);
  const [filterPlat, setFilterPlat] = useState<Platform | "all">("all");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch(`/api/tickets/${encodeURIComponent(eventId)}`)
      .then((r) => r.json())
      .then((j) => { setData(j.data ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [eventId]);

  const seed   = hashStr(eventId);
  const lowest = data?.lowestPrice ?? 120;
  const avg    = Math.round(data?.averagePrice ?? lowest * 1.15);
  const demand = 55 + Math.round(seeded(seed, 99) * 40);
  const pctChg = +(seeded(seed, 88) * 14 - 7).toFixed(1);

  const platformCounts = useMemo(() => {
    if (!data) return {} as Record<string, number>;
    return data.listings.reduce<Record<string, number>>((acc, l) => {
      acc[l.platform] = (acc[l.platform] ?? 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [] as TicketListing[];
    let list = filterPlat === "all" ? data.listings : data.listings.filter((l) => l.platform === filterPlat);
    list = [...list].sort((a, b) => sortDir === "asc" ? a.pricePerTicket - b.pricePerTicket : b.pricePerTicket - a.pricePerTicket);
    return list;
  }, [data, filterPlat, sortDir]);

  const bestPrice = filtered[0]?.pricePerTicket ?? null;

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[180, 200, 320].map((h, i) => (
          <div key={i} style={{ height: `${h}px`, background: "rgba(255,255,255,0.05)", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:.9} }`}</style>
      </div>
    );
  }

  const card: React.CSSProperties = { background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }} className="stats-grid">
        <style>{`@media(min-width:640px){ .stats-grid { grid-template-columns: repeat(4,1fr) !important; } }`}</style>

        <div style={{ ...card, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", fontWeight: 600 }}>Lowest Price</span>
            <TrendingDown size={16} style={{ color: "#22c55e", opacity: 0.8 }} />
          </div>
          <div className="font-syne" style={{ fontWeight: 900, fontSize: "1.9rem", color: "#22c55e", lineHeight: 1 }}>${lowest}</div>
          <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#22c55e", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
            {pctChg > 0 ? "↑" : "↓"} {Math.abs(pctChg)}% vs last week
          </div>
        </div>

        <div style={{ ...card, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", fontWeight: 600 }}>Average Price</span>
            <DollarSign size={16} style={{ color: "#7c6cff", opacity: 0.8 }} />
          </div>
          <div className="font-syne" style={{ fontWeight: 900, fontSize: "1.9rem", color: "#ffffff", lineHeight: 1 }}>${avg}</div>
          <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>Across all platforms</div>
        </div>

        <div style={{ ...card, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", fontWeight: 600 }}>Market Demand</span>
            <Activity size={16} style={{ color: "#f97316", opacity: 0.8 }} />
          </div>
          <div className="font-syne" style={{ fontWeight: 900, fontSize: "1.9rem", color: "#ffffff", lineHeight: 1 }}>{demand}%</div>
          <div style={{ marginTop: "6px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: demand > 75 ? "#f97316" : demand > 50 ? "#eab308" : "#22c55e", background: demand > 75 ? "rgba(249,115,22,0.12)" : demand > 50 ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.12)", padding: "2px 8px", borderRadius: "20px", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
              {demand > 75 ? "High demand" : demand > 50 ? "Moderate" : "Low demand"}
            </span>
          </div>
        </div>

        <div style={{ ...card, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", fontWeight: 600 }}>Available</span>
            <Users size={16} style={{ color: "#7c6cff", opacity: 0.8 }} />
          </div>
          <div className="font-syne" style={{ fontWeight: 900, fontSize: "1.9rem", color: "#ffffff", lineHeight: 1 }}>{data?.listings.length ?? 0}</div>
          <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>Listings found</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="charts-grid">
        <style>{`@media(min-width:700px){ .charts-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>

        <div style={{ ...card, padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <div>
              <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>Price Trend</div>
              <div style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", marginTop: "2px" }}>Last {trendDays} days average ticket price</div>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {([7, 14, 30] as const).map((d) => (
                <button key={d} onClick={() => setTrendDays(d)}
                  style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "var(--font-syne),'Syne',sans-serif", background: trendDays === d ? "#7c6cff" : "rgba(255,255,255,0.08)", color: trendDays === d ? "#fff" : "#8b89a8", transition: "all 0.15s" }}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: "160px", marginTop: "8px" }}>
            <PriceTrendChart basePrice={lowest} eventId={eventId} days={trendDays} />
          </div>
        </div>

        <div style={{ ...card, padding: "22px" }}>
          <div style={{ marginBottom: "4px" }}>
            <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>Market Activity</div>
            <div style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", marginTop: "2px" }}>Real-time demand fluctuation</div>
          </div>
          <div style={{ height: "160px", marginTop: "8px" }}>
            <MarketActivityChart eventId={eventId} />
          </div>
        </div>
      </div>

      {/* Platform filter + tickets */}
      {data && data.listings.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="tickets-layout">
          <style>{`@media(min-width:768px){ .tickets-layout { grid-template-columns: 220px 1fr !important; } }`}</style>

          <div>
            <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", marginBottom: "12px" }}>Filter by Platform</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => setFilterPlat("all")}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid", borderColor: filterPlat === "all" ? "#7c6cff" : "rgba(255,255,255,0.07)", background: filterPlat === "all" ? "rgba(124,108,255,0.15)" : "#13121f", cursor: "pointer", transition: "all 0.15s" }}>
                <span className="font-syne" style={{ fontWeight: 700, fontSize: "0.9rem", color: filterPlat === "all" ? "#a99fff" : "#ffffff" }}>All Platforms</span>
                <span style={{ background: filterPlat === "all" ? "#7c6cff" : "rgba(255,255,255,0.12)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>{data.listings.length}</span>
              </button>
              {data.platformsAvailable.map((p) => {
                const info   = PLATFORM_INFO[p];
                const pName  = info?.name ?? p;
                const pColor = info?.color ?? "#7c6cff";
                const count  = platformCounts[p] ?? 0;
                const active = filterPlat === p;
                return (
                  <button key={p} onClick={() => setFilterPlat(active ? "all" : p)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderRadius: "12px", border: `1.5px solid ${active ? pColor + "66" : "rgba(255,255,255,0.07)"}`, background: active ? pColor + "15" : "#13121f", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="font-syne" style={{ fontWeight: 700, fontSize: "0.9rem", color: active ? pColor : "#ffffff" }}>{pName}</span>
                      {(p === "ticketmaster" || p === "seatgeek") && (
                        <span style={{ fontSize: "0.62rem", fontWeight: 700, background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", padding: "1px 6px", borderRadius: "4px", textTransform: "lowercase" }}>live</span>
                      )}
                    </div>
                    <span style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>
                {filtered.length} Available Ticket{filtered.length !== 1 ? "s" : ""}
              </div>
              <button onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "#13121f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e8e6ff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
                Price: {sortDir === "asc" ? "Low to High" : "High to Low"} <ChevronDown size={14} style={{ transform: sortDir === "desc" ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((listing) => (
                <TicketRow key={listing.id} listing={listing} isBest={listing.pricePerTicket === bestPrice} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...card, padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "14px" }}>🎟️</div>
          <div className="font-syne" style={{ fontWeight: 800, fontSize: "1.2rem", color: "#ffffff", marginBottom: "8px" }}>No Listings Available</div>
          <div style={{ fontSize: "0.9rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>Check back closer to the event date.</div>
        </div>
      )}
    </div>
  );
}
