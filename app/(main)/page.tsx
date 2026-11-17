export const dynamic = "force-dynamic";

import HeroSearch from "@/components/search/HeroSearch";
import RotatingBadge from "@/components/ui/RotatingBadge";
import NearbyEventsSection from "@/components/events/NearbyEventsSection";
import { Search, BarChart3, Ticket } from "lucide-react";
import RefreshEventsButton from "@/components/ui/RefreshEventsButton";
import { getUpcomingPopularEvents } from "@/lib/upcomingEvents";

const STEPS = [
  { icon: Search,    number: "01", title: "Search Your Event", description: "Enter the team, game, or event you want to attend and we'll find it." },
  { icon: BarChart3, number: "02", title: "Compare Prices",    description: "See Ticketmaster, SeatGeek, StubHub, Vivid Seats and more side by side, all in one place." },
  { icon: Ticket,    number: "03", title: "Get Best Deal",     description: "Pick the best option and buy directly from that site." },
];

// Only claims that are true today
const STATS = [
  { value: "7",    label: "Ticket Sites"        },
  { value: "4",    label: "Major Leagues"       },
  { value: "$0",   label: "Fees From SeatScout" },
  { value: "100%", label: "Free to Use"         },
];

export default async function HomePage() {
  const upcomingEvents = await getUpcomingPopularEvents(3);

  return (
    <div className="w-full overflow-x-hidden">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden text-center pt-[96px] pb-[56px] md:pt-[140px] md:pb-[160px] md:min-h-[100vh]">
        <div
          className="orb-float pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] md:h-[900px] md:w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,106,247,0.22) 0%, transparent 65%)", zIndex: 0 }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 sm:px-[60px]">
          <div className="fade-up-0 mb-8 md:mb-12"><RotatingBadge /></div>
          <h1 className="font-syne fade-up-1 mx-auto mb-6 max-w-[900px] text-[clamp(40px,11vw,88px)] font-[800] leading-[1.05] tracking-[-1.5px] md:mb-10 md:tracking-[-2px]">
            Find the <em className="not-italic text-[var(--brand-light)]">Best</em><br />Seat Deals
          </h1>
          <p className="fade-up-2 mx-auto mb-10 max-w-[520px] text-[16px] leading-[1.65] text-[var(--text-2)] md:mb-16 md:text-[18px]">
            Compare ticket prices from Ticketmaster, StubHub, SeatGeek, and Vivid Seats in one place. Never overpay for seats again.
          </p>
          <div className="fade-up-3 mb-6 flex w-full flex-col items-center"><HeroSearch /></div>
          <div className="mx-auto mt-10 grid w-full max-w-[900px] grid-cols-2 gap-3 md:mt-[60px] md:flex md:gap-0">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center border border-[var(--card-border)] bg-[var(--card)] px-3 py-5 md:flex-1 md:px-8 md:py-10 text-center rounded-xl md:rounded-none
                  ${i === 0 ? "md:rounded-l-2xl" : "md:border-l-0"}
                  ${i === STATS.length - 1 ? "md:rounded-r-2xl" : ""}`}
              >
                <div className="font-syne mb-1.5 text-[26px] md:text-[36px] font-[800] leading-none text-[var(--text-1)]">{stat.value}</div>
                <div className="text-[12px] leading-tight text-[var(--text-2)] md:text-[13px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full overflow-x-hidden bg-[var(--bg-1)] py-[56px] md:py-[100px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 sm:px-[60px]">
          <div className="section-tag text-center">HOW IT WORKS</div>
          <h2 className="section-title text-center" style={{ fontSize: "clamp(30px,4.4vw,55px)" }}>Three Simple Steps to Save</h2>
          <p className="section-sub text-center">Finding the best ticket prices has never been easier</p>
          <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="group relative overflow-hidden rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] p-6 text-left transition-all duration-200 md:p-[48px_36px] md:hover:-translate-y-1 md:hover:border-[rgba(124,106,247,0.3)]">
                  <div className="font-syne pointer-events-none absolute bottom-4 right-5 select-none text-[56px] font-[800] leading-none text-[rgba(124,106,247,0.08)] md:bottom-5 md:right-6 md:text-[72px]">{step.number}</div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[rgba(124,106,247,0.25)] bg-[var(--brand-dim)] md:mb-8 md:h-14 md:w-14">
                    <Icon className="size-6 text-[var(--brand-light)]" />
                  </div>
                  <h3 className="font-syne relative mb-2 text-[19px] font-[700] tracking-[-0.3px] text-[var(--text-1)] md:mb-4 md:text-[20px]">{step.title}</h3>
                  <p className="relative text-[14px] leading-[1.7] text-[var(--text-2)]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="results" className="w-full overflow-x-hidden bg-[var(--bg)] py-[56px] md:py-[140px]">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-[60px]">
          <div className="mb-8 flex flex-col items-center gap-3 text-center md:mb-12">
            <div className="section-tag">UPCOMING EVENTS</div>
            <h2 className="section-title" style={{ marginBottom: 0, fontSize: "clamp(30px,4.4vw,55px)" }}>Popular Events Near You</h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>Top {upcomingEvents.length} upcoming games this week</p>
          </div>
          <NearbyEventsSection initialEvents={upcomingEvents} />
          <div className="mb-6 mt-10 text-center md:mb-10 md:mt-[60px]">
            <RefreshEventsButton />
          </div>
        </div>
      </section>

    </div>
  );
}
