import Link from "next/link";

const SECTIONS = [
  { title: "Acceptance of Terms", body: ["By accessing or using SeatScout, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.", "We reserve the right to modify these terms at any time. Continued use of SeatScout after any changes constitutes your acceptance of the updated terms."] },
  { title: "Description of Service", body: ["SeatScout is a ticket price comparison platform that aggregates publicly available listings from third-party ticket marketplaces including Ticketmaster, StubHub, SeatGeek, and Vivid Seats.", "SeatScout does not sell tickets. We provide comparison information only. All purchases are completed on the respective third-party platform, and you are subject to their terms and conditions."] },
  { title: "Accuracy of Information", body: ["We strive to display accurate, up-to-date pricing information. However, ticket prices, availability, and event details are provided by third-party platforms and may change at any time without notice.", "SeatScout makes no warranties, express or implied, regarding the accuracy, completeness, or timeliness of any information displayed on the platform.", "Always verify pricing and event details on the originating platform before completing a purchase."] },
  { title: "Prohibited Uses", body: ["You agree not to use SeatScout for any unlawful purpose or in a way that could damage, disable, or impair the service.", "Automated scraping, crawling, or data extraction of SeatScout content without prior written permission is strictly prohibited.", "You may not use the service to distribute spam, malware, or any harmful content."] },
  { title: "Intellectual Property", body: ["All content on SeatScout, including but not limited to text, graphics, logos, and software, is the property of SeatScout and is protected by applicable intellectual property laws.", "Ticket images and event information are the property of their respective owners and are displayed pursuant to API agreements with those platforms."] },
  { title: "Disclaimer of Warranties", body: ["SeatScout is provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied.", "We do not warrant that the service will be uninterrupted, error-free, or free of viruses or other harmful components."] },
  { title: "Limitation of Liability", body: ["To the fullest extent permitted by law, SeatScout shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.", "Our total liability for any claim arising out of or relating to these terms or the service shall not exceed $100 USD."] },
  { title: "Governing Law", body: ["These Terms of Service shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.", "Any disputes arising under these terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association."] },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>
      <div style={{ padding: "clamp(110px, 14vw, 160px) clamp(20px, 5vw, 48px) clamp(50px, 7vw, 70px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse at center, rgba(124,108,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "30px", padding: "6px 18px", marginBottom: "28px", fontSize: "0.8rem", fontWeight: 700, color: "#a99fff", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-syne), 'Syne', sans-serif", position: "relative", zIndex: 1 }}>Last Updated: April 2026</div>
        <h1 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(40px, 7.5vw, 100px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#ffffff", textTransform: "uppercase", position: "relative", zIndex: 1 }}>Terms of<br /><span style={{ color: "#7c6cff" }}>Service</span></h1>
        <p style={{ marginTop: "24px", color: "#8b89a8", fontSize: "1.05rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7, position: "relative", zIndex: 1, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Please read these terms carefully before using SeatScout. By using the service, you agree to be bound by these terms.</p>
      </div>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 60px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {SECTIONS.map((s, i) => (
          <div key={s.title} style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <span style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "#7c6cff", letterSpacing: "0.1em", textTransform: "uppercase" }}>0{i + 1}</span>
              <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff" }}>{s.title}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {s.body.map((para, j) => (<p key={j} style={{ fontSize: "0.93rem", color: "#8b89a8", lineHeight: 1.8, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>{para}</p>))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "780px", margin: "0 auto 100px", padding: "0 clamp(20px, 5vw, 48px)" }}>
        <div style={{ padding: "clamp(28px, 5vw, 40px)", background: "linear-gradient(135deg, #1a1838 0%, #151330 100%)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(124,108,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
          <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#ffffff", textTransform: "uppercase", position: "relative" }}>Questions About Our Terms?</h3>
          <p style={{ marginTop: "8px", color: "#8b89a8", fontSize: "0.92rem", position: "relative", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>We&apos;re happy to clarify anything. Reach out and we&apos;ll get back to you within 24 hours.</p>
          <Link href="/contact" style={{ display: "inline-block", marginTop: "20px", padding: "11px 28px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "0.92rem", borderRadius: "30px", textDecoration: "none", position: "relative" }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
