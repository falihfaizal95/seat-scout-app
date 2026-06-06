"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Ticket } from "lucide-react";

const COUNTRIES: { code: string; name: string }[] = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" }, { code: "AU", name: "Australia" }, { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" }, { code: "BR", name: "Brazil" }, { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" }, { code: "CN", name: "China" }, { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croatia" }, { code: "CZ", name: "Czech Republic" }, { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" }, { code: "FI", name: "Finland" }, { code: "FR", name: "France" },
  { code: "DE", name: "Germany" }, { code: "GH", name: "Ghana" }, { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" }, { code: "IN", name: "India" }, { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" }, { code: "KE", name: "Kenya" }, { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" }, { code: "MA", name: "Morocco" }, { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" }, { code: "NG", name: "Nigeria" }, { code: "NO", name: "Norway" },
  { code: "PK", name: "Pakistan" }, { code: "PE", name: "Peru" }, { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" }, { code: "PT", name: "Portugal" }, { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" }, { code: "SA", name: "Saudi Arabia" }, { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" }, { code: "ES", name: "Spain" }, { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" }, { code: "TW", name: "Taiwan" }, { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" }, { code: "UA", name: "Ukraine" }, { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" }, { code: "US", name: "United States" }, { code: "VN", name: "Vietnam" },
];

const inputClass =
  "w-full rounded-[10px] border border-[var(--card-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[15px] text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-2)] focus:border-[rgba(124,106,247,0.5)]";

export default function OnboardingPage() {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form    = e.currentTarget;
    const dob     = (form.elements.namedItem("dob")     as HTMLInputElement).value;
    const country = (form.elements.namedItem("country") as HTMLSelectElement).value;
    const zipInput = form.elements.namedItem("zipCode") as HTMLInputElement | null;
    const zipCode  = zipInput?.value ?? "";
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob, country, zipCode: country === "US" ? zipCode : undefined }),
      });
    } catch { /* best-effort */ }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16" style={{ background: "var(--bg)" }}>
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,106,247,0.15) 0%, transparent 70%)" }} />
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b79f0] to-[#5452c8] shadow-[0_0_20px_rgba(109,106,232,0.35)]">
            <Ticket size={17} className="text-white" />
          </div>
          <span className="font-syne text-[20px] font-[800] text-[var(--text-1)]">Seat<span className="text-[var(--brand-light)]">Scout</span></span>
        </Link>
        <div className="w-full rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] p-8">
          <div className="mb-6">
            <h1 className="font-syne mb-1.5 text-[24px] font-[800] tracking-[-0.5px] text-[var(--text-1)]">One last step 👋</h1>
            <p className="text-[14px] leading-[1.7] text-[var(--text-2)]">Tell us a bit about yourself so we can personalise your experience.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-[var(--text-2)]">Date of birth</label>
              <input name="dob" type="date" required max={new Date().toISOString().split("T")[0]} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-[var(--text-2)]">Country of residence</label>
              <select name="country" required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
                <option value="" disabled>Select your country…</option>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            {country === "US" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-[500] text-[var(--text-2)]">ZIP code</label>
                <input name="zipCode" type="text" required placeholder="e.g. 10001" pattern="[0-9]{5}" maxLength={5} inputMode="numeric" className={inputClass} />
                <span className="text-[12px] text-[var(--text-3)]">5-digit US ZIP code</span>
              </div>
            )}
            <button type="submit" disabled={loading} className="font-syne mt-1 h-[52px] w-full rounded-[10px] bg-[var(--brand)] text-[15px] font-[800] text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-light)] hover:shadow-[0_8px_24px_rgba(124,106,247,0.3)] disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Saving…" : "Continue to SeatScout →"}
            </button>
          </form>
        </div>
        <div className="mt-5 text-center flex flex-col gap-1">
          <p className="text-[12px] text-[var(--text-3)]">You can update these anytime in your account settings.</p>
          <Link href="/" className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">Skip for now →</Link>
        </div>
      </div>
    </div>
  );
}
