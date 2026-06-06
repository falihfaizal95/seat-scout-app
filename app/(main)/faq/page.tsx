"use client";
import { useState } from "react";
import { ChevronDown, X, Send } from "lucide-react";

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "13px 16px",
    color: "#e8e6ff",
    fontSize: "0.95rem",
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", padding: "20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "500px", background: "#13121f", border: "1px solid rgba(124,108,255,0.3)", borderRadius: "20px", padding: "36px", position: "relative" }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#8b89a8", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={16} />
        </button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✅</div>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#ffffff", marginBottom: "8px" }}>Message Sent!</h3>
            <p style={{ color: "#8b89a8", fontSize: "0.95rem", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
              We&apos;ll get back to you at {form.email} within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#ffffff", marginBottom: "6px" }}>Get in Touch</h3>
            <p style={{ color: "#8b89a8", fontSize: "0.9rem", marginBottom: "28px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
              Fill out the form below and we&apos;ll respond within 24 hours.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="contact-name-phone" style={{ display: "grid", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", color: "#8b89a8", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Name</label>
                  <input required placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
                <div>
                  <label style={{ display: "block", color: "#8b89a8", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Phone</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", color: "#8b89a8", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Email</label>
                <input required type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
              <div>
                <label style={{ display: "block", color: "#8b89a8", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Message</label>
                <textarea required rows={4} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "none" }} onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
              <button
                type="submit"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px", padding: "14px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", borderRadius: "10px", border: "none", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#6a5ae0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#7c6cff")}
              >
                <Send size={15} /> Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const FAQS = [
  { q: "What is SeatScout?", a: "SeatScout is a ticket price comparison platform that aggregates listings from multiple resale marketplaces — including StubHub, SeatGeek, Ticketmaster, and more — so you can instantly find the best deal for any event without bouncing between tabs." },
  { q: "Is SeatScout free to use?", a: "Yes — SeatScout is completely free. You never pay us anything. We make money through referral partnerships with ticket platforms, not by charging you." },
  { q: "How does SeatScout find prices so fast?", a: "We query multiple ticket marketplace APIs simultaneously and return results in real time. Our caching layer ensures popular events load instantly while keeping prices up to date." },
  { q: "Which platforms does SeatScout compare?", a: "Currently we compare StubHub, SeatGeek, Ticketmaster Resale, Vivid Seats, AXS, Gametime, and TickPick. We're actively adding more partners — check back often." },
  { q: "What sports and events are covered?", a: "NFL, NBA, MLB, NHL, MLS, college sports, concerts, comedy shows, theater, and more. If it's on a major resale platform, SeatScout can find it." },
  { q: "Do I buy the ticket through SeatScout?", a: "No — SeatScout is a comparison engine. When you click a listing, you're taken directly to the partner platform to complete your purchase. Your payment info stays between you and them." },
  { q: "Are the prices shown all-in, including fees?", a: "We display all-in pricing wherever the platform supports it. Some platforms don't expose full fee breakdowns via API, so we'll always flag when a displayed price may not include service fees." },
  { q: "How much can I actually save using SeatScout?", a: "On average, users find savings of 15–30% versus buying from the first platform they check. For high-demand events the gap between platforms can be much larger." },
  { q: "Do I need an account to use SeatScout?", a: "Not at all. You can search and compare prices instantly without signing up. Creating an account unlocks price alerts and saved searches." },
  { q: "Are the tickets on SeatScout guaranteed to be legitimate?", a: "We only surface listings from established, buyer-guaranteed marketplaces. Each partner platform carries their own guarantee — SeatScout links you to the platform's own guarantee page so you know exactly what you're covered for before you buy." },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{ background: isOpen ? "#1a1830" : "#13121f", border: `1px solid ${isOpen ? "rgba(124,108,255,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", marginBottom: "6px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "22px 28px", color: isOpen ? "#a99fff" : "#ffffff", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: "1.05rem", fontWeight: 600, transition: "color 0.2s" }}>
        <span>{q}</span>
        <ChevronDown size={20} style={{ flexShrink: 0, color: "#7c6cff", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
      <div style={{ maxHeight: isOpen ? "300px" : "0px", overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <p style={{ padding: "0 28px 22px", color: "#8b89a8", fontSize: "0.97rem", lineHeight: 1.7, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [showContact, setShowContact] = useState(false);

  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      <div style={{ padding: "clamp(110px,14vw,160px) clamp(20px,5vw,48px) clamp(50px,7vw,80px)", textAlign: "center", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", top: "80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse at center, rgba(124,108,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h1 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(64px,10vw,120px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#ffffff", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          Frequently<br />Asked<br />Questions
        </h1>
        <p style={{ marginTop: "24px", color: "#8b89a8", fontSize: "1.05rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, position: "relative", zIndex: 1, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          Everything you need to know about comparing ticket prices with SeatScout.
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 40px" }}>
        {FAQS.map((item, i) => (
          <FAQItem key={item.q} q={item.q} a={item.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>

      <div style={{ maxWidth: "860px", margin: "12px auto 100px", padding: "0 24px" }}>
        <div style={{ padding: "clamp(32px,6vw,48px) clamp(20px,5vw,40px)", background: "linear-gradient(135deg, #1a1838 0%, #151330 100%)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(124,108,255,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.01em", color: "#ffffff", textTransform: "uppercase", position: "relative" }}>Still have questions?</h2>
          <p style={{ marginTop: "10px", color: "#8b89a8", fontSize: "0.95rem", position: "relative", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
            Can&apos;t find the answer you&apos;re looking for? Reach out and we&apos;ll get back to you.
          </p>
          <button
            onClick={() => setShowContact(true)}
            style={{ display: "inline-block", marginTop: "24px", padding: "13px 32px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", borderRadius: "30px", border: "none", cursor: "pointer", transition: "background 0.2s, transform 0.15s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6a5ae0"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124,108,255,0.35)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#7c6cff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
          >
            Contact Us
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .contact-name-phone { grid-template-columns: 1fr 1fr; }
        @media (max-width: 480px) { .contact-name-phone { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
