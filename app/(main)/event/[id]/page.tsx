import { Suspense } from "react";
import { parseEventId } from "@/lib/utils";
import EventPageClient from "./EventPageClient";

async function fetchTMEventName(eventId: string): Promise<{ name: string | null; tmUrl: string | null }> {
  try {
    const { source, externalId } = parseEventId(eventId);
    if (source !== "tm" || !process.env.TICKETMASTER_API_KEY) return { name: null, tmUrl: null };
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${externalId}.json?apikey=${process.env.TICKETMASTER_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { name: null, tmUrl: null };
    const e = await res.json();
    return { name: e.name ?? null, tmUrl: e.url ?? null };
  } catch {
    return { name: null, tmUrl: null };
  }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name: tmName, tmUrl: tmUrlFromApi } = await fetchTMEventName(id);

  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#0e0d18" }} />}>
      <EventPageClient tmEventName={tmName} tmUrlFromApi={tmUrlFromApi} />
    </Suspense>
  );
}
