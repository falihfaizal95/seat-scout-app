"use client";
import { useState, useEffect } from "react";
import HomepageEventCard from "./HomepageEventCard";
import type { HomepageEvent } from "@/lib/upcomingEvents";
import { MapPin, Loader2 } from "lucide-react";

interface Props {
  initialEvents: HomepageEvent[];
}

type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export default function NearbyEventsSection({ initialEvents }: Props) {
  const [events, setEvents] = useState<HomepageEvent[]>(initialEvents);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStatus("granted");
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `/api/events/nearby?lat=${latitude}&lng=${longitude}`
          );
          if (!res.ok) return;
          const data = await res.json() as { events: HomepageEvent[]; city: string | null };

          if (data.city) setCity(data.city);

          if (data.events.length > 0) {
            // Pad with initial events if fewer than 3 nearby events found
            const merged = [...data.events];
            for (const ev of initialEvents) {
              if (merged.length >= 3) break;
              if (!merged.find((e) => e.id === ev.id)) merged.push(ev);
            }
            setEvents(merged.slice(0, 3));
          }
        } catch {
          // keep initialEvents on error
        }
      },
      () => {
        setStatus("denied");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [initialEvents]);

  return (
    <>
      {/* Location pill */}
      <div className="flex justify-center" style={{ marginBottom: "8px", minHeight: "28px" }}>
        {status === "requesting" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-4 py-1.5 text-[13px] text-[var(--text-2)]">
            <Loader2 size={12} className="animate-spin" />
            Detecting your location…
          </span>
        )}
        {status === "granted" && city && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] px-4 py-1.5 text-[13px] font-[600] text-[var(--green)]">
            <MapPin size={12} />
            Events near {city}
          </span>
        )}
        {status === "denied" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-1.5 text-[12px] text-[var(--text-3)]">
            <MapPin size={12} />
            Enable location for local events
          </span>
        )}
      </div>

      {/* Grid — always 3 cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <HomepageEventCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}
