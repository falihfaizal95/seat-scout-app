"use client";
import { useState } from "react";
import { Send, Mail, MessageSquare } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "14px 16px",
  color: "#e8e6ff",
  fontSize: "0.97rem",
  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const TOPICS = ["General Question", "Pricing Issue", "Bug Report", "Partnership", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: "#0e0d18", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "clamp(110px, 14vw, 160px) clamp(20px, 5vw, 48px) clamp(50px, 7vw, 70px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse at center, rgba(124,108,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.25)", borderRadius: "30px", padding: "6px 18px", marginBottom: "28px", fontSize: "0.8rem", fontWeight: 700, color: "#a99fff", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-syne), 'Syne', sans-serif", position: "relative", zIndex: 1 }}>
          Get In Touch
        </div>

        <h1 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(52px, 9vw, 110px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#ffffff", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          Contact
          <br />
          <span style={{ color: "#7c6cff" }}>Us</span>
        </h1>

        <p style={{ marginTop: "24px", color: "#8b89a8", fontSize: "1.05rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7, position: "relative", zIndex: 1, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          Have a question or found an issue? We respond to every message within 24 hours.
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 100px", display: "grid", gap: "24px", gridTemplateColumns: "1fr" }} className="contact-layout">

        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @media(min-width:700px){ .contact-layout { grid-template-columns: 1fr 2fr !important; } }
        `}</style>

        {/* Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { icon: Mail, title: "Email Us", body: "support@seatscout.com", sub: "Response within 24h" },
            { icon: MessageSquare, title: "Live Chat", body: "Available in-app", sub: "Mon–Fri, 9am–6pm ET" },
          ].map(({ icon: Icon, title, body, sub }) => (
            <div key={title} style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "11px", background: "rgba(124,108,255,0.12)", border: "1px solid rgba(124,108,255,0.2)", marginBottom: "14px" }}>
                <Icon size={20} style={{ color: "#a99fff" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#ffffff", marginBottom: "4px" }}>{title}</h3>
              <p style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: "0.9rem", color: "#7c6cff", fontWeight: 600, marginBottom: "2px" }}>{body}</p>
              <p style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8b89a8" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: "#13121f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "clamp(28px, 4vw, 40px)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
              <h3 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "8px" }}>Message Sent!</h3>
              <p style={{ color: "#8b89a8", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>We&apos;ll get back to you at <strong style={{ color: "#a99fff" }}>{form.email}</strong> within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#ffffff", marginBottom: "24px" }}>Send a Message</h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }} className="form-two-col">
                  <style>{`@media(max-width:480px){ .form-two-col { grid-template-columns: 1fr !important; } }`}</style>
                  <div>
                    <label style={{ display: "block", color: "#8b89a8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Name</label>
                    <input required placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#8b89a8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Email</label>
                    <input required type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "#8b89a8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Topic</label>
                  <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
                    {TOPICS.map((t) => <option key={t} value={t} style={{ background: "#13121f" }}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", color: "#8b89a8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>Message</label>
                  <textarea required rows={5} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(124,108,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>

                <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "15px", background: "#7c6cff", color: "#ffffff", fontFamily: "var(--font-syne), 'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", borderRadius: "12px", border: "none", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#6a5ae0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#7c6cff")}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
