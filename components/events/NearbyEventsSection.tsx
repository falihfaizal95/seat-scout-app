"use client";
import { useState, useEffect } from "react";
import HomepageEventCard from "./HomepageEventCard";
import type { HomepageEvent } from "@/lib/upcomingEvents";
import { MapPin, Loader2 } from "lucide-react";

const LS_KEY = "seatscout_loc";

type Status = "new" | "requesting" | "loading" | "granted" | "denied" | "unavailable";

export default function NearbyEventsSection({ initialEvents }: { initialEvents: HomepageEvent[] }) {
  const [events, setEvents] = useState<HomepageEvent[]>(initialEvents);
  const [status, setStatus] = useState<Status>("new");
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setStatus("unavailable"); return; }
    const stored = localStorage.getItem(LS_KEY);
    if (stored === "granted") {
      // Returning user who already allowed — re-fetch silently
      doGeoFetch();
    } else if (stored === "denied") {
      setStatus("denied");
    }
    // else: first visit — show the "allow" button (status stays "new")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requestLocation() {
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        localStorage.setItem(LS_KEY, "granted");
        doGeoFetch(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        localStorage.setItem(LS_KEY, "denied");
        setStatus("denied");
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  async function doGeoFetch(lat?: number, lng?: number) {
    // If no coords passed, get them fresh
    if (lat === undefined || lng === undefined) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doGeoFetch(pos.coords.latitude, pos.coords.longitude),
        () => setStatus("denied")
      );
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`/api/events/nearby?lat=${lat}&lng=${lng}`);
      if (!res.ok) { setStatus("granted"); return; }
      const data = await res.json() as { events: HomepageEvent[]; city: string | null };
      if (data.city) setCity(data.city);
      if (data.events.length > 0) {
        // Pad to 3 with fallback events if nearby returns fewer
        const merged = [...data.events];
        for (const ev of initialEvents) {
          if (merged.length >= 3) break;
          if (!merged.find((e) => e.id === ev.id)) merged.push(ev);
        }
        setEvents(merged.slice(0, 3));
      }
    } catch { /* keep initial events */ }
    setStatus("granted");
  }

  return (
    <>
      {/* Location pill / prompt */}
      <div className="flex justify-center" style={{ marginBottom: "28px", minHeight: "36px" }}>
        {status === "new" && (
          <button
            onClick={requestLocation}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,106,247,0.4)] bg-[rgba(124,106,247,0.1)] px-5 py-2 text-[13px] font-[600] text-[var(--brand-light)] transition-all hover:bg-[rgba(124,106,247,0.2)] hover:shadow-[0_0_20px_rgba(124,106,247,0.2)]"
          >
            <MapPin size={13} />
            See events near you — tap to allow location
          </button>
        )}
        {status === "requesting" && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-5 py-2 text-[13px] text-[var(--text-2)]">
            <Loader2 size={13} className="animate-spin" />
            Waiting for location permission…
          </span>
        )}
        {status === "loading" && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-5 py-2 text-[13px] text-[var(--text-2)]">
            <Loader2 size={13} className="animate-spin" />
            Finding events near you…
          </span>
        )}
        {status === "granted" && city && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)] px-5 py-2 text-[13px] font-[600] text-[var(--green)]">
            <MapPin size={13} />
            Events near {city}
          </span>
        )}
        {status === "denied" && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-2 text-[12px] text-[var(--text-3)]">
            <MapPin size={12} />
            Enable location in browser settings to see local events
          </span>
        )}
      </div>

      {/* Always 3 cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <HomepageEventCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}
