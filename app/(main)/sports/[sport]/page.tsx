"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NormalizedEvent } from "@/types/event";

const SPORT_CONFIG: Record<string, { label: string; classification: string; color: string; emoji: string }> = {
  nba: { label: "NBA",  classification: "Basketball",       color: "#f97316", emoji: "🏀" },
  nfl: { label: "NFL",  classification: "American Football", color: "#22c55e", emoji: "🏈" },
  mlb: { label: "MLB",  classification: "Baseball",          color: "#ef4444", emoji: "⚾" },
  nhl: { label: "NHL",  classification: "Ice Hockey",        color: "#38bdf8", emoji: "🏒" },
};

function EventCard({ event }: { event: NormalizedEvent }) {
  const hasTeams = event.homeTeam && event.awayTeam;
  const date = new Date(event.eventDate);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <Link href={`/event/tm_${event.id.replace(/^tm_/, "")}?title=${encodeURIComponent(event.name)}&date=${encodeURIComponent(event.eventDate)}&location=${encodeURIComponent(`${event.venue ?? ""}${event.city ? `, ${event.city}` : ""}`)}&sport=${encodeURIComponent(event.sport ?? "")}`} className="group block">
      <div
        style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.16)"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 36px rgba(0,0,0,0.45)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
      >
        <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "#1a1830" }}>
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.imageUrl} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", opacity: 0.15 }}>🎟️</div>
          )}
          {event.lowestPrice && (
            <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "6px", padding: "3px 9px", fontSize: "0.75rem", fontWeight: 700, color: "#22c55e" }}>
              From ${event.lowestPrice}
            </div>
          )}
        </div>
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          {hasTeams ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", lineHeight: 1.1 }}>{event.awayTeam}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#7b799a", textTransform: "uppercase", letterSpacing: "0.08em" }}>vs</span>
              <span className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", lineHeight: 1.1 }}>{event.homeTeam}</span>
            </div>
          ) : (
            <h3 className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", marginBottom: "8px", lineHeight: 1.2 }}>{event.name}</h3>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#7b799a" }}>
              <Calendar size={12} style={{ opacity: 0.6, flexShrink: 0 }} />
              {dateStr} · {timeStr}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#7b799a" }}>
              <MapPin size={12} style={{ opacity: 0.6, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.venue}{event.city ? `, ${event.city}` : ""}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "0.78rem", color: "#7b799a" }}>ticketmaster</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#a99fff", display: "flex", alignItems: "center", gap: "4px" }}>View Deals <ArrowRight size={13} /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EventCardSkeleton() {
  return (
    <div style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
      <div style={{ width: "100%", aspectRatio: "16/9", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ height: "16px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", marginBottom: "8px", width: "80%" }} />
        <div style={{ height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", marginBottom: "6px", width: "60%" }} />
        <div style={{ height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", width: "70%" }} />
      </div>
    </div>
  );
}

export default function SportPage() {
  const params = useParams();
  const slug = (params?.sport as string)?.toLowerCase() ?? "";
  const config = SPORT_CONFIG[slug];

  const [events, setEvents]   = useState<NormalizedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!config) return;
    setLoading(true);
    fetch(`/api/search?classificationName=${encodeURIComponent(config.classification)}`)
      .then((r) => r.json())
      .then((json) => { setEvents(Array.isArray(json.events) ? json.events : []); setLoading(false); })
      .catch(() => { setError("Failed to load events."); setLoading(false); });
  }, [config?.classification]);

  if (!config) {
    return (
      <div style={{ background: "#0e0d18", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 className="font-syne" style={{ fontSize: "2rem", fontWeight: 900, color: "#ffffff", marginBottom: "12px" }}>Sport Not Found</h1>
          <Link href="/" style={{ color: "#7c6cff", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>
      <div style={{ padding: "clamp(100px,13vw,150px) clamp(20px,5vw,48px) clamp(50px,7vw,70px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "60px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: `radial-gradient(ellipse at center, ${config.color}22 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${config.color}18`, border: `1px solid ${config.color}44`, borderRadius: "30px", padding: "6px 18px", marginBottom: "28px", fontSize: "0.8rem", fontWeight: 700, color: config.color, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-syne),'Syne',sans-serif", position: "relative", zIndex: 1 }}>
          {config.emoji} Live Tickets
        </div>
        <h1 style={{ fontFamily: "var(--font-syne),'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(80px,18vw,180px)", lineHeight: 0.9, letterSpacing: "-0.04em", color: "#ffffff", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          {config.label}
        </h1>
        <p style={{ marginTop: "20px", color: "#8b89a8", fontSize: "1rem", position: "relative", zIndex: 1, fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
          {loading ? "Loading upcoming events…" : error ? "" : `${events.length} upcoming event${events.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(16px,4vw,48px) 100px" }}>
        {loading && (
          <div className="sport-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
            {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        )}
        {error && <div style={{ textAlign: "center", padding: "80px 0" }}><p style={{ color: "#ef4444" }}>{error}</p></div>}
        {!loading && !error && events.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>{config.emoji}</div>
            <h3 className="font-syne" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", textTransform: "uppercase", marginBottom: "10px" }}>No Upcoming Events</h3>
            <p style={{ color: "#8b89a8", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", maxWidth: "360px", margin: "0 auto", lineHeight: 1.7 }}>There are no {config.label} events available right now. Check back soon.</p>
            <Link href="/search" style={{ display: "inline-block", marginTop: "28px", padding: "12px 28px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne),'Syne',sans-serif", fontWeight: 700, fontSize: "0.92rem", borderRadius: "30px", textDecoration: "none" }}>Search Events</Link>
          </div>
        )}
        {!loading && events.length > 0 && (
          <div className="sport-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) { .sport-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 800px)  { .sport-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px)  { .sport-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
