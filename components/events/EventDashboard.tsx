"use client";
import { useState, useEffect, useMemo } from "react";
import { TrendingDown, DollarSign, Radio, Store, ExternalLink, ChevronDown } from "lucide-react";
import type { AggregatedTickets, Platform, PlatformLink, TicketListing } from "@/types/ticket";

// ── Helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_DISPLAY: Record<string, string> = {
  ticketmaster: "Ticketmaster",
  stubhub: "StubHub",
  seatgeek: "SeatGeek",
  vividseats: "Vivid Seats",
  axs: "AXS",
  gametime: "Gametime",
  tickpick: "TickPick",
};

const PLATFORM_COLOR: Record<string, string> = {
  ticketmaster: "#026CDF",
  stubhub: "#FF5C00",
  seatgeek: "#05C053",
  vividseats: "#6B21A8",
  axs: "#E31837",
  gametime: "#FF6B00",
  tickpick: "#1DB5BE",
};

const FONT_BODY = "var(--font-dm-sans), 'DM Sans', sans-serif";
const card: React.CSSProperties = { background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px" };

const money = (n: number | null | undefined) => (n == null ? "—" : `$${Math.round(n)}`);

// ── Stat card ─────────────────────────────────────────────────────────────────

function Stat({ label, value, note, icon: Icon, accent }: {
  label: string; value: string; note: string; icon: typeof DollarSign; accent?: boolean;
}) {
  return (
    <div style={{ ...card, padding: "20px 22px", ...(accent ? { background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" } : {}) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <span style={{ fontSize: "0.78rem", color: "#8b89a8", fontFamily: FONT_BODY, fontWeight: 600 }}>{label}</span>
        <Icon size={16} style={{ color: accent ? "#22c55e" : "#7c6cff", opacity: 0.8 }} />
      </div>
      <div className="font-syne" style={{ fontWeight: 900, fontSize: "1.9rem", color: accent ? "#22c55e" : "#ffffff", lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#8b89a8", fontFamily: FONT_BODY }}>{note}</div>
    </div>
  );
}

// ── Ticket Row (real listings only) ───────────────────────────────────────────

function TicketRow({ listing, isBest }: { listing: TicketListing; isBest: boolean }) {
  const pName  = PLATFORM_DISPLAY[listing.platform] ?? listing.platform;
  const pColor = PLATFORM_COLOR[listing.platform] ?? "#7c6cff";

  return (
    <div
      style={{
        background: isBest ? "rgba(34,197,94,0.06)" : "#13121f",
        border: `1.5px solid ${isBest ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 160px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>{listing.section}</span>
          {isBest && (
            <span style={{ background: "#22c55e", color: "#fff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "20px" }}>
              Lowest
            </span>
          )}
        </div>
        {listing.row && (
          <div style={{ fontSize: "0.82rem", color: "#8b89a8", fontFamily: FONT_BODY }}>Row {listing.row}</div>
        )}
      </div>

      <span style={{ background: `${pColor}22`, border: `1px solid ${pColor}55`, color: pColor, fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", fontFamily: FONT_BODY, whiteSpace: "nowrap" }}>
        {pName}
      </span>

      <div style={{ flex: "0 0 auto", textAlign: "right" }}>
        <div style={{ fontSize: "0.7rem", color: "#8b89a8", fontFamily: FONT_BODY, marginBottom: "2px" }}>Per ticket</div>
        <div className="font-syne" style={{ fontWeight: 800, fontSize: "1.25rem", color: isBest ? "#22c55e" : "#ffffff" }}>
          {money(listing.pricePerTicket)}
        </div>
      </div>

      <a
        href={listing.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-90"
        style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "6px", background: "#7c6cff", color: "#fff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", whiteSpace: "nowrap" }}
      >
        View on {pName} <ExternalLink size={13} />
      </a>
    </div>
  );
}

// ── Site links ────────────────────────────────────────────────────────────────

function SiteLinks({ links, hasLive }: { links: PlatformLink[]; hasLive: boolean }) {
  return (
    <div style={{ ...card, padding: "22px" }}>
      <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>
        {hasLive ? "Check the other sites" : "Check prices on each site"}
      </div>
      <div style={{ fontSize: "0.82rem", color: "#8b89a8", fontFamily: FONT_BODY, marginTop: "4px", marginBottom: "16px" }}>
        {hasLive
          ? "We don't get live prices from these sites yet. Each link opens this event on that site."
          : "We don't have live prices for this event yet. Each link opens this event on that site so you can compare."}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "8px" }}>
        {links.map((l) => {
          const pColor = PLATFORM_COLOR[l.platform] ?? "#7c6cff";
          return (
            <a
              key={l.platform}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:border-white/20"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", textDecoration: "none" }}
            >
              <span className="font-syne" style={{ fontWeight: 700, fontSize: "0.9rem", color: pColor }}>
                {PLATFORM_DISPLAY[l.platform] ?? l.platform}
              </span>
              <ExternalLink size={14} style={{ color: "#8b89a8" }} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

interface Props {
  eventId: string;
  eventName?: string;
  /** Ticketmaster's page for this event, when we know it */
  tmUrl?: string;
}

export default function EventDashboard({ eventId, eventName, tmUrl }: Props) {
  const [data, setData]             = useState<AggregatedTickets | null>(null);
  const [loading, setLoading]       = useState(true);
  const [failed, setFailed]         = useState(false);
  const [filterPlat, setFilterPlat] = useState<Platform | "all">("all");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let cancelled = false;
    const url = `/api/tickets/${encodeURIComponent(eventId)}${eventName ? `?name=${encodeURIComponent(eventName)}` : ""}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => { if (!cancelled) setData(j.data ?? null); })
      .catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventId, eventName]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const list = filterPlat === "all" ? data.listings : data.listings.filter((l) => l.platform === filterPlat);
    return [...list].sort((a, b) => sortDir === "asc" ? a.pricePerTicket - b.pricePerTicket : b.pricePerTicket - a.pricePerTicket);
  }, [data, filterPlat, sortDir]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[120, 320].map((h, i) => (
          <div key={i} style={{ height: `${h}px`, background: "rgba(255,255,255,0.05)", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:.9} }`}</style>
      </div>
    );
  }

  if (failed || !data) {
    return (
      <div style={{ ...card, padding: "48px", textAlign: "center" }}>
        <div className="font-syne" style={{ fontWeight: 800, fontSize: "1.2rem", color: "#ffffff", marginBottom: "8px" }}>Couldn&apos;t load prices</div>
        <div style={{ fontSize: "0.9rem", color: "#8b89a8", fontFamily: FONT_BODY }}>Please refresh the page in a moment.</div>
      </div>
    );
  }

  // Prefer the exact Ticketmaster event page when the page knows it
  const links      = data.links.map((l) => (l.platform === "ticketmaster" && tmUrl && !l.live ? { ...l, url: tmUrl } : l));
  const liveLinks  = links.filter((l) => l.live);
  const otherLinks = links.filter((l) => !l.live);
  const hasLive    = data.listings.length > 0;
  const bestPrice  = data.lowestPrice;
  const liveNames  = liveLinks.map((l) => PLATFORM_DISPLAY[l.platform]).join(" & ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Stats (real data only) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }} className="stats-grid">
        <style>{`@media(min-width:640px){ .stats-grid { grid-template-columns: repeat(4,1fr) !important; } }`}</style>
        <Stat label="Lowest Price" value={money(data.lowestPrice)} note={hasLive ? `Live from ${liveNames}` : "No live prices yet"} icon={TrendingDown} accent={hasLive} />
        <Stat label="Average Price" value={money(data.averagePrice)} note={hasLive ? "Across live listings" : "No live prices yet"} icon={DollarSign} />
        <Stat label="Live Sources" value={String(liveLinks.length)} note={`of ${links.length} sites`} icon={Radio} />
        <Stat label="Sites to Check" value={String(links.length)} note="Links below" icon={Store} />
      </div>

      {/* ── Live listings ── */}
      {hasLive && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="tickets-layout">
          <style>{`@media(min-width:768px){ .tickets-layout { grid-template-columns: 220px 1fr !important; } }`}</style>

          <div>
            <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", marginBottom: "12px" }}>Filter by Site</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(["all", ...data.platformsAvailable] as const).map((p) => {
                const active = filterPlat === p;
                const pColor = p === "all" ? "#7c6cff" : PLATFORM_COLOR[p] ?? "#7c6cff";
                const count  = p === "all" ? data.listings.length : data.listings.filter((l) => l.platform === p).length;
                return (
                  <button key={p} onClick={() => setFilterPlat(p)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderRadius: "12px", border: `1.5px solid ${active ? pColor + "66" : "rgba(255,255,255,0.07)"}`, background: active ? pColor + "15" : "#13121f", cursor: "pointer" }}>
                    <span className="font-syne" style={{ fontWeight: 700, fontSize: "0.9rem", color: active ? pColor : "#ffffff" }}>
                      {p === "all" ? "All Sites" : PLATFORM_DISPLAY[p]}
                    </span>
                    <span style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>
                Live Prices
              </div>
              <button onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "#13121f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e8e6ff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY }}>
                Price: {sortDir === "asc" ? "Low to High" : "High to Low"} <ChevronDown size={14} style={{ transform: sortDir === "desc" ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((listing) => (
                <TicketRow key={listing.id} listing={listing} isBest={listing.pricePerTicket === bestPrice} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Every site we can't read prices from yet ── */}
      <SiteLinks links={hasLive ? otherLinks : links} hasLive={hasLive} />
    </div>
  );
}
