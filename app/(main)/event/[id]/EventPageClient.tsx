"use client";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import LocalEventDate from "@/components/ui/LocalEventDate";
import EventDashboard from "@/components/events/EventDashboard";

interface Props {
  tmEventName: string | null;
  tmUrlFromApi: string | null;
}

export default function EventPageClient({ tmEventName, tmUrlFromApi }: Props) {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();

  const urlTitle   = sp.get("title") ?? "";
  const isoDate    = sp.get("date") ?? "";
  const location   = sp.get("location") ?? "";
  const imageUrl   = sp.get("image") ?? "";
  const sport      = sp.get("sport") ?? "";
  const urlTmUrl   = sp.get("tmUrl") ?? "";

  // prefer URL param title, fall back to server-fetched TM name
  const title  = urlTitle || tmEventName || "Event";
  const tmUrl  = urlTmUrl || tmUrlFromApi || "";

  const sportEmojis: Record<string, string> = {
    NFL: "🏈", NBA: "🏀", MLB: "⚾", NHL: "🏒", MLS: "⚽",
    NCAAF: "🏈", NCAAB: "🏀", UFC: "🥊", Boxing: "🥊", Tennis: "🎾",
  };
  const emoji = sportEmojis[sport] ?? "🎟️";

  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {imageUrl && (
          <div style={{ position: "absolute", inset: 0, height: "360px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl} alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px)", opacity: 0.12, transform: "scale(1.1)" }}
              crossOrigin="anonymous"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,13,24,0.3) 0%, rgba(14,13,24,0.7) 50%, #0e0d18 100%)" }} />
          </div>
        )}

        <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", padding: "40px clamp(20px,4vw,48px) 48px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#8b89a8", textDecoration: "none", marginBottom: "32px", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
            <ArrowLeft size={14} /> Back to events
          </Link>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sport && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "30px", padding: "5px 14px", fontSize: "0.78rem", fontWeight: 700, color: "#a99fff", width: "fit-content", fontFamily: "var(--font-syne),'Syne',sans-serif" }}>
                {emoji} {sport}
              </span>
            )}
            <h1 className="font-syne" style={{ fontWeight: 900, fontSize: "clamp(24px,4vw,44px)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.88rem", color: "#8b89a8" }}>
              {isoDate && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
                  <Calendar size={14} style={{ color: "#7c6cff" }} />
                  <LocalEventDate isoDate={isoDate} />
                </div>
              )}
              {location && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif" }}>
                  <MapPin size={14} style={{ color: "#7c6cff" }} />
                  {location}
                </div>
              )}
              {tmUrl && (
                <a href={tmUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", color: "#7c6cff", textDecoration: "none", fontFamily: "var(--font-dm-sans),'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>
                  Official page ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px,4vw,48px) 80px" }}>
        <EventDashboard eventId={id} eventName={title} />
      </div>

    </div>
  );
}
