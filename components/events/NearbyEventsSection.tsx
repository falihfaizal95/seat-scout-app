"use client";
import { useEffect, useState } from "react";
import HomepageEventCard from "./HomepageEventCard";
import type { HomepageEvent } from "@/lib/upcomingEvents";

const LS_KEY = "seatscout_loc";
type LocPref = "granted" | "denied";
type Status = "new" | "requesting" | "loading" | "done" | "denied" | "unavailable";

interface Props {
  initialEvents: HomepageEvent[];
}

export default function NearbyEventsSection({ initialEvents }: Props) {
  const [events, setEvents] = useState<HomepageEvent[]>(initialEvents);
  const [city, setCity] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("new");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    const saved = localStorage.getItem(LS_KEY) as LocPref | null;
    if (saved === "granted") {
      silentFetch();
    } else if (saved === "denied") {
      setStatus("denied");
    }
  }, []);

  function silentFetch() {
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => doGeoFetch(pos.coords.latitude, pos.coords.longitude),
      () => setStatus("done"),
      { timeout: 8000 }
    );
  }

  function requestLocation() {
    if (!navigator.geolocation) { setStatus("unavailable"); return; }
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
      { timeout: 10000 }
    );
  }

  async function doGeoFetch(lat: number, lng: number) {
    setStatus("loading");
    try {
      const res = await fetch(`/api/events/nearby?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      const nearbyEvents: HomepageEvent[] = json.events ?? [];
      setCity(json.city ?? null);

      const merged = [...nearbyEvents];
      for (const ev of initialEvents) {
        if (merged.length >= 3) break;
        if (!merged.find((e) => e.id === ev.id)) merged.push(ev);
      }
      setEvents(merged.slice(0, 3));
    } catch {
      // keep initialEvents
    }
    setStatus("done");
  }

  const showPrompt = status === "new";
  const showLoading = status === "requesting" || status === "loading";

  return (
    <div>
      {showPrompt && (
        <div className="mb-16 flex justify-center">
          <button
            onClick={requestLocation}
            className="font-syne inline-flex items-center gap-3 rounded-[14px] bg-[var(--brand)] px-8 py-4 text-[15px] font-[700] text-white transition-all hover:bg-[var(--brand-light)] hover:shadow-[0_8px_24px_rgba(124,106,247,0.35)]"
          >
            📍 See events near your location
          </button>
        </div>
      )}

      {status === "denied" && (
        <p className="mb-6 text-center text-[13px] text-[var(--text-3)]">
          Location access denied — showing popular events instead. Enable in your browser settings to see nearby events.
        </p>
      )}

      {status === "unavailable" && (
        <p className="mb-6 text-center text-[13px] text-[var(--text-3)]">
          Geolocation not available — showing popular upcoming events.
        </p>
      )}

      {city && status === "done" && (
        <p className="mb-6 text-center text-[14px] text-[var(--text-2)]">
          Showing events near <span className="font-[700] text-[var(--text-1)]">{city}</span>
        </p>
      )}

      {showLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[480px] rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <HomepageEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
