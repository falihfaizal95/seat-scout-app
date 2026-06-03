"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NormalizedEvent } from "@/types/event";

const POPULAR = ["Lakers", "Yankees", "Cowboys", "Warriors"];

const FILTERS = [
  { id: "all",  label: "All" },
  { id: "home", label: "Home Games" },
  { id: "away", label: "Away Games" },
  { id: "soon", label: "Next 7 Days" },
];

function segmentDotColor(segment?: string): string {
  switch (segment) {
    case "Music":          return "#3b82f6";
    case "Arts & Theatre": return "#eab308";
    case "Comedy":         return "#f97316";
    default:               return "#ef4444"; // Sports / default
  }
}

function applyFilter(events: NormalizedEvent[], filter: string, query: string): NormalizedEvent[] {
  const q = query.toLowerCase();
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return events.filter((e) => {
    if (filter === "home") return e.homeTeam?.toLowerCase().includes(q);
    if (filter === "away") return e.awayTeam?.toLowerCase().includes(q);
    if (filter === "soon") {
      const d = new Date(e.eventDate);
      return d >= now && d <= in7;
    }
    return true;
  });
}

function EventCard({ event }: { event: NormalizedEvent }) {
  const label = event.sport || event.segment || "Event";
  const dotColor = segmentDotColor(event.segment);
  const hasTeams = event.homeTeam && event.awayTeam;

  const date = new Date(event.eventDate);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <Link href={`/event/${event.id}`} className="group block" style={{ height: "100%" }}>
      <div
        style={{
          height: "100%",
          background: "#13121f",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(255,255,255,0.16)";
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = "0 12px 36px rgba(0,0,0,0.45)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "rgba(255,255,255,0.07)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}
      >
        {/* Banner */}
        <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "#1a1830", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
          ) : (
            <span style={{ fontSize: "3rem", opacity: 0.15 }}>🎟️</span>
          )}
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
          {/* Category badge */}
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "4px 9px", fontSize: "0.7rem", fontWeight: 600, color: "#ffffff", letterSpacing: "0.03em" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
            {label}
          </div>
          {/* Price badge */}
          {event.lowestPrice && (
            <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "6px", padding: "3px 9px", fontSize: "0.75rem", fontWeight: 700, color: "#22c55e" }}>
              From ${event.lowestPrice}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Matchup / title */}
          {hasTeams ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", lineHeight: 1.1 }}>{event.homeTeam}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#7b799a", letterSpacing: "0.08em", textTransform: "uppercase" }}>vs</span>
              <span className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", lineHeight: 1.1 }}>{event.awayTeam}</span>
            </div>
          ) : (
            <h3 className="font-syne" style={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff", marginBottom: "8px", lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {event.name}
            </h3>
          )}

          {/* Meta */}
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

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "0.78rem", color: "#7b799a" }}>{event.source || "Ticketmaster"}</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#a99fff", display: "flex", alignItems: "center", gap: "4px", transition: "gap 0.2s" }}>
              View Deals <ArrowRight size={13} />
            </span>
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

function SearchContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initQ = searchParams.get("q") ?? "";

  const [query,    setQuery]    = useState(initQ);
  const [events,   setEvents]   = useState<NormalizedEvent[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [filter,   setFilter]   = useState("all");

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setFilter("all");
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json() as { events?: NormalizedEvent[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Search failed");
      setEvents(Array.isArray(json.events) ? json.events : []);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initQ) doSearch(initQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
    doSearch(query);
  };

  const filtered = applyFilter(events, filter, query);

  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>

      {/* Search bar area */}
      <div style={{ paddingTop: "100px", paddingBottom: 0, paddingLeft: "clamp(16px, 4vw, 48px)", paddingRight: "clamp(16px, 4vw, 48px)", maxWidth: "1300px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", alignItems: "center", background: "#1a1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s" }}
            onFocusCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,108,255,0.5)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(124,108,255,0.12)"; }}
            onBlurCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <span style={{ padding: "0 20px 0 24px", color: "#7b799a", flexShrink: 0 }}>
              <Search size={20} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, artists, events, venues..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#ffffff", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: "1.1rem", padding: "22px 0", caretColor: "#7c6cff" }}
            />
            <button
              type="submit"
              style={{ margin: "8px", padding: "16px 32px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", border: "none", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "0.02em", transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#6a5ae0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#7c6cff")}
            >
              Search Deals →
            </button>
          </div>
        </form>

        {/* Popular tags */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
          <span style={{ color: "#7b799a", fontSize: "0.85rem", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Popular:</span>
          {POPULAR.map((tag) => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); router.replace(`/search?q=${encodeURIComponent(tag)}`, { scroll: false }); doSearch(tag); }}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e6ff", fontSize: "0.82rem", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", cursor: "pointer", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", transition: "background 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px clamp(16px, 4vw, 48px) 100px", animation: "fadeUp 0.5s ease both" }}>

        {searched && !loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "0.95rem", color: "#7b799a", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
              <strong style={{ color: "#ffffff", fontWeight: 600 }}>{filtered.length} events</strong> for &ldquo;{query}&rdquo;
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    background: filter === f.id ? "rgba(124,108,255,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${filter === f.id ? "rgba(124,108,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                    color: filter === f.id ? "#a99fff" : "#7b799a",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    padding: "6px 14px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="search-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#ef4444", fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {!loading && searched && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔍</div>
            <h3 className="font-syne" style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>No events found</h3>
            <p style={{ color: "#7b799a", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
              Try a different search or filter.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="search-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontSize: "4.5rem", marginBottom: "20px" }}>🏟️</div>
            <h3 className="font-syne" style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>Search any event</h3>
            <p style={{ color: "#7b799a", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", maxWidth: "400px", margin: "0 auto" }}>
              Search for sports, concerts, theater, comedy, and more.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1100px) { .search-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 800px)  { .search-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px)  { .search-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#0e0d18", minHeight: "100vh", paddingTop: "120px", paddingLeft: "48px", paddingRight: "48px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ height: "72px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", marginBottom: "40px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}