export const dynamic = "force-dynamic";

import HeroSearch from "@/components/search/HeroSearch";
import RotatingBadge from "@/components/ui/RotatingBadge";
import RollingCounter from "@/components/ui/RollingCounter";
import RollingSavings from "@/components/ui/RollingSavings";
import { Search, BarChart3, Ticket } from "lucide-react";
import RefreshEventsButton from "@/components/ui/RefreshEventsButton";
import { getUpcomingPopularEvents } from "@/lib/upcomingEvents";
import NearbyEventsSection from "@/components/events/NearbyEventsSection";

const STEPS = [
  {
    icon: Search,
    number: "01",
    title: "Search Your Event",
    description: "Enter the team, game, or event you want to attend. We'll instantly find all available listings across every major platform.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Compare Prices",
    description: "View side-by-side prices from Ticketmaster, StubHub, SeatGeek, and Vivid Seats in real-time — all in one place.",
  },
  {
    icon: Ticket,
    number: "03",
    title: "Get Best Deal",
    description: "See the cheapest option highlighted in green. Click to purchase directly from the platform with confidence.",
  },
];

const STATS = [
  { value: "1M+",   label: "Tickets Compared" },
  { value: "4",     label: "Platforms"         },
  { value: "$2.5M", label: "Total Saved"       },
  { value: "50K+",  label: "Happy Users"       },
];

export default async function HomePage() {
  const upcomingEvents = await getUpcomingPopularEvents(3);

  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden text-center pt-[100px] pb-[80px] md:pt-[140px] md:pb-[200px] md:min-h-[160vh]">
        <div
          className="orb-float pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] md:h-[900px] md:w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,106,247,0.22) 0%, transparent 65%)", zIndex: 0 }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 sm:px-[60px]">
          <div className="fade-up-0" style={{ marginBottom: "48px" }}>
            <RotatingBadge />
          </div>
          <h1 className="font-syne fade-up-1 mx-auto mb-10 max-w-[900px] text-[clamp(48px,7vw,88px)] font-[800] leading-[1.05] tracking-[-2px]">
            Find the <em className="not-italic text-[var(--brand-light)]">Best</em><br />
            Seat Deals
          </h1>
          <p className="fade-up-2 mx-auto max-w-[520px] text-[18px] leading-[1.7] text-[var(--text-2)]" style={{ marginBottom: "64px" }}>
            Compare ticket prices from Ticketmaster, StubHub, SeatGeek, and Vivid Seats in one place. Never overpay for seats again.
          </p>
          <div className="fade-up-3 flex w-full flex-col items-center" style={{ marginBottom: "24px" }}>
            <HeroSearch />
          </div>
          <div className="mx-auto grid w-full max-w-[900px] grid-cols-2 gap-3 md:flex md:gap-0" style={{ marginTop: "60px" }}>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center border border-[var(--card-border)] bg-[var(--card)] px-4 py-6 md:flex-1 md:px-8 md:py-10 text-center rounded-xl md:rounded-none
                  ${i === 0 ? "md:rounded-l-2xl" : "md:border-l-0"}
                  ${i === STATS.length - 1 ? "md:rounded-r-2xl" : ""}`}
              >
                <div className="font-syne mb-1.5 text-[26px] md:text-[36px] font-[800] leading-none text-[var(--text-1)]">
                  {stat.label === "Total Saved" ? (
                    <RollingCounter start={100_000} incrementMin={500} incrementMax={2_000} intervalMs={5000} prefix="$" />
                  ) : stat.label === "Happy Users" ? (
                    <RollingCounter start={100} incrementMin={1} incrementMax={5} intervalMs={5000} suffix="+" />
                  ) : stat.label === "Tickets Compared" ? (
                    <RollingCounter start={250_000} incrementMin={500} incrementMax={2_000} intervalMs={5000} suffix="+" />
                  ) : stat.value}
                </div>
                <div className="text-[13px] text-[var(--text-2)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="w-full overflow-x-hidden bg-[var(--bg-1)] py-[60px] md:py-[100px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 sm:px-[60px]">
          <div className="section-tag text-center">HOW IT WORKS</div>
          <h2 className="section-title text-center" style={{ fontSize: "clamp(35px,4.4vw,55px)" }}>Three Simple Steps to Save</h2>
          <p className="section-sub text-center">Finding the best ticket prices has never been easier</p>
          <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="group relative overflow-hidden rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] p-[48px_36px] text-left transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(124,106,247,0.3)]">
                  <div className="font-syne pointer-events-none absolute bottom-5 right-6 select-none text-[72px] font-[800] leading-none text-[rgba(124,106,247,0.08)]">{step.number}</div>
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[14px] border border-[rgba(124,106,247,0.25)] bg-[var(--brand-dim)]">
                    <Icon className="size-6 text-[var(--brand-light)]" />
                  </div>
                  <h3 className="font-syne relative mb-4 text-[20px] font-[700] tracking-[-0.3px] text-[var(--text-1)]">{step.title}</h3>
                  <p className="relative text-[14px] leading-[1.75] text-[var(--text-2)]">{step.description}</p>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "80px", marginBottom: "80px" }} className="inline-flex items-center gap-[10px] rounded-full border border-[rgba(34,197,94,0.2)] bg-[var(--green-dim)] px-6 py-3 text-[var(--green)]">
            <span className="text-[15px] font-[600]">💰 Average savings:</span>
            <span className="font-syne text-[28px] font-[800] leading-none"><RollingSavings /> per ticket</span>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────── */}
      <section id="results" className="w-full overflow-x-hidden bg-[var(--bg)] py-[60px] md:py-[140px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-[60px]">
          <div className="mb-8 flex flex-col items-center text-center gap-3">
            <div className="section-tag">UPCOMING EVENTS</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Popular Events Near You</h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              Top {upcomingEvents.length} upcoming events · Live prices
            </p>
          </div>

          <NearbyEventsSection initialEvents={upcomingEvents} />

          <div style={{ marginTop: "60px", marginBottom: "40px" }} className="text-center">
            <RefreshEventsButton />
          </div>
        </div>
      </section>

    </div>
  );
}
