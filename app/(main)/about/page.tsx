import Link from "next/link";
import { Search, BarChart3, Ticket, Users, TrendingDown, Globe } from "lucide-react";

const STATS = [
  { value: "4+",    label: "Platforms Compared" },
  { value: "50K+",  label: "Happy Users"        },
  { value: "$2.5M", label: "Total Saved"        },
  { value: "100%",  label: "Free to Use"        },
];

const VALUES = [
  {
    icon: TrendingDown,
    title: "Save More, Always",
    body: "We built SeatScout because we got tired of overpaying. Our entire mission is putting money back in your pocket by surfacing the lowest ticket prices across every major platform.",
  },
  {
    icon: Globe,
    title: "Total Transparency",
    body: "We never mark up prices or take a cut from your purchase. What you see is exactly what each platform charges. No hidden fees, no inflated numbers — just honest comparisons.",
  },
  {
    icon: Users,
    title: "Built for Fans",
    body: "Every feature we ship is driven by real fan feedback. We're fans ourselves — NBA, NFL, MLB, NHL — and we build the tool we wish existed when we were buying tickets.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div
        style={{
          padding: "clamp(110px, 14vw, 160px) clamp(20px, 5vw, 48px) clamp(60px, 8vw, 80px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: "80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse at center, rgba(124,108,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "30px", padding: "6px 18px", marginBottom: "28px", fontSize: "0.8rem", fontWeight: 700, color: "#a99fff", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-syne), 'Syne', sans-serif", position: "relative", zIndex: 1 }}>
          Our Story
        </div>

        <h1
          style={{
            fontFamily: "var(--font-syne), 'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(52px, 9vw, 110px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            textTransform: "uppercase",
            position: "relative",
            zIndex: 1,
          }}
        >
          About
          <br />
          <span style={{ color: "#7c6cff" }}>SeatScout</span>
        </h1>

        <p style={{ marginTop: "24px", color: "#8b89a8", fontSize: "1.05rem", maxWidth: "560px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7, position: "relative", zIndex: 1, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          We&apos;re on a mission to make sure every fan gets a fair deal. No more bouncing between tabs. No more overpaying.
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }} className="sm:grid-cols-4-auto">
          <style>{`.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; } @media(min-width:640px){ .stat-grid { grid-template-columns: repeat(4, 1fr); } }`}</style>
          <div className="stat-grid" style={{ gridColumn: "1 / -1" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px 16px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 40px)", color: "#7c6cff", lineHeight: 1, marginBottom: "8px" }}>{s.value}</div>
                <div style={{ fontSize: "0.82rem", color: "#8b89a8", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Story ── */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 80px" }}>
        <div style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "clamp(32px, 5vw, 56px)" }}>
          <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 38px)", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "20px" }}>
            Why We Built This
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "#8b89a8", fontSize: "0.97rem", lineHeight: 1.8, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
            <p>It started with a $400 mistake. Our founder bought floor seats to an NBA playoff game on the first platform he checked — only to find the same seats on a different site for $260. That &apos;s $140 gone because of one tab.</p>
            <p>So we built SeatScout: a single page that pulls live listings from Ticketmaster, StubHub, SeatGeek, and Vivid Seats simultaneously and sorts them by price. No accounts, no fees, no nonsense.</p>
            <p>Today, thousands of fans use SeatScout every week to find the best deal before they buy. We&apos;re growing fast — and we&apos;re just getting started.</p>
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 80px" }}>
        <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 38px)", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "32px", textAlign: "center" }}>
          What We Stand For
        </h2>
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr" }} className="values-grid">
          <style>{`.values-grid { display: grid; gap: 16px; grid-template-columns: 1fr; } @media(min-width:640px){ .values-grid { grid-template-columns: repeat(3,1fr); } }`}</style>
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "32px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.2)", marginBottom: "20px" }}>
                  <Icon size={22} style={{ color: "#a99fff" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff", marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#8b89a8", lineHeight: 1.75, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>{v.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: "780px", margin: "0 auto 100px", padding: "0 clamp(20px, 5vw, 48px)" }}>
        <div style={{ padding: "clamp(32px, 6vw, 48px) clamp(20px, 5vw, 40px)", background: "linear-gradient(135deg, #1a1838 0%, #151330 100%)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(124,108,255,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#ffffff", textTransform: "uppercase", position: "relative" }}>Ready to Save?</h2>
          <p style={{ marginTop: "10px", color: "#8b89a8", fontSize: "0.95rem", position: "relative", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
            Start comparing ticket prices across every platform — completely free.
          </p>
          <Link
            href="/search"
            style={{ display: "inline-block", marginTop: "24px", padding: "13px 32px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", borderRadius: "30px", textDecoration: "none", position: "relative", letterSpacing: "0.02em" }}
          >
            Compare Prices Now
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
