import { Suspense } from "react";
import EventPageClient from "./EventPageClient";

export default function EventPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)] pt-24" />}>
      <EventPageClient />
    </Suspense>
  );
}
