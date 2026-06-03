import Link from "next/link";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: [
      "When you use SeatScout, we may collect information you provide directly — such as your name and email address if you create an account or submit a contact form.",
      "We also collect usage data automatically, including pages visited, search queries entered, links clicked, device type, browser, and approximate location derived from IP address. This data is used solely to improve the product.",
      "We do not collect or store payment information. All purchases are completed directly on third-party ticket platforms — SeatScout never handles transactions.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "To operate and improve SeatScout — understanding how users search and compare helps us make the product better.",
      "To communicate with you — if you create an account, we may send transactional emails such as price alerts or saved-search updates. You can opt out at any time.",
      "To comply with legal obligations — we retain data only as long as necessary and in accordance with applicable law.",
    ],
  },
  {
    title: "Third-Party Platforms",
    body: [
      "SeatScout retrieves live ticket data from Ticketmaster, StubHub, SeatGeek, and Vivid Seats via their public APIs. When you click through to purchase, you are subject to those platforms' own privacy policies.",
      "We are not responsible for the data practices of third-party ticket platforms. We recommend reviewing their privacy policies before completing a purchase.",
    ],
  },
  {
    title: "Cookies & Tracking",
    body: [
      "We use cookies to maintain session state (e.g., keeping you logged in) and for anonymous analytics via tools such as Vercel Analytics. We do not use advertising cookies or sell data to ad networks.",
      "You can disable cookies in your browser settings. Some features may not function correctly if cookies are disabled.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We implement industry-standard security measures including HTTPS encryption, secure authentication via Clerk, and minimal data retention policies.",
      "No method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You have the right to access, correct, or delete any personal information we hold about you. To exercise these rights, contact us at support@seatscout.com.",
      "If you are located in the European Economic Area, you may have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the 'Last Updated' date at the top of this page. Continued use of SeatScout after changes constitutes acceptance of the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>
      <div style={{ padding: "clamp(110px, 14vw, 160px) clamp(20px, 5vw, 48px) clamp(50px, 7vw, 70px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse at center, rgba(124,108,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "30px", padding: "6px 18px", marginBottom: "28px", fontSize: "0.8rem", fontWeight: 700, color: "#a99fff", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-syne), 'Syne', sans-serif", position: "relative", zIndex: 1 }}>
          Last Updated: April 2026
        </div>
        <h1 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(44px, 8vw, 100px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#ffffff", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          Privacy<br /><span style={{ color: "#7c6cff" }}>Policy</span>
        </h1>
        <p style={{ marginTop: "24px", color: "#8b89a8", fontSize: "1.05rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7, position: "relative", zIndex: 1, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          Your privacy matters. Here&apos;s exactly what data we collect, how we use it, and how we protect it.
        </p>
      </div>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 60px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {SECTIONS.map((s, i) => (
          <div key={s.title} style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <span style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "#7c6cff", letterSpacing: "0.1em", textTransform: "uppercase" }}>0{i + 1}</span>
              <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff" }}>{s.title}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {s.body.map((para, j) => (
                <p key={j} style={{ fontSize: "0.93rem", color: "#8b89a8", lineHeight: 1.8, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "780px", margin: "0 auto 100px", padding: "0 clamp(20px, 5vw, 48px)" }}>
        <div style={{ padding: "clamp(28px, 5vw, 40px)", background: "linear-gradient(135deg, #1a1838 0%, #151330 100%)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(124,108,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
          <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#ffffff", textTransform: "uppercase", position: "relative" }}>Privacy Questions?</h3>
          <p style={{ marginTop: "8px", color: "#8b89a8", fontSize: "0.92rem", position: "relative", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Reach out and we&apos;ll respond within 24 hours.</p>
          <Link href="/contact" style={{ display: "inline-block", marginTop: "20px", padding: "11px 28px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "0.92rem", borderRadius: "30px", textDecoration: "none", position: "relative" }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
