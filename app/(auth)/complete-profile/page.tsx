"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { completeProfile } from "@/app/actions/completeProfile";

const COUNTRIES = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" }, { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" }, { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" }, { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" }, { code: "CL", name: "Chile" },
  { code: "CN", name: "China" }, { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croatia" }, { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" }, { code: "EG", name: "Egypt" },
  { code: "FI", name: "Finland" }, { code: "FR", name: "France" },
  { code: "DE", name: "Germany" }, { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" }, { code: "HU", name: "Hungary" },
  { code: "IN", name: "India" }, { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" }, { code: "JP", name: "Japan" },
  { code: "KE", name: "Kenya" }, { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" }, { code: "MA", name: "Morocco" },
  { code: "NL", name: "Netherlands" }, { code: "NZ", name: "New Zealand" },
  { code: "NG", name: "Nigeria" }, { code: "NO", name: "Norway" },
  { code: "PK", name: "Pakistan" }, { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" }, { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" }, { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" }, { code: "SA", name: "Saudi Arabia" },
  { code: "ZA", name: "South Africa" }, { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" }, { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" }, { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" }, { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" }, { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" }, { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
];

const inputClass =
  "w-full rounded-[10px] border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-[15px] text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-2)] focus:border-[rgba(124,106,247,0.4)]";

export default function CompleteProfilePage() {
  const [country, setCountry] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      try {
        await completeProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setError("Something went wrong. Please try again.");
        }
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-[0.06]" />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b79f0] to-[#5452c8] shadow-[0_0_20px_rgba(109,106,232,0.4)]">
            <Ticket size={17} className="text-white" />
          </div>
          <span className="font-syne text-[18px] font-[800] text-white">
            Seat<span className="text-[var(--brand-light)]">Scout</span>
          </span>
        </Link>
        <div className="w-full rounded-[20px] border border-[var(--card-border)] bg-[var(--card)] p-8">
          <h1 className="font-syne mb-1 text-[22px] font-[800] text-[var(--text-1)]">Complete your profile</h1>
          <p className="mb-6 text-[14px] text-[var(--text-2)]">Just a few details to personalise your experience.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-[500] text-[var(--text-2)]">First name</label>
                <input name="firstName" type="text" required placeholder="John" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-[500] text-[var(--text-2)]">Last name</label>
                <input name="lastName" type="text" required placeholder="Doe" className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-[var(--text-2)]">Date of birth</label>
              <input name="dateOfBirth" type="date" required className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[500] text-[var(--text-2)]">Country of residence</label>
              <select name="country" required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
                <option value="" disabled>Select country…</option>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            {country === "US" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-[500] text-[var(--text-2)]">ZIP code</label>
                <input name="zipCode" type="text" required placeholder="e.g. 10001" maxLength={10} className={inputClass} />
              </div>
            )}
            {error && <p className="text-[13px] text-red-400">{error}</p>}
            <button type="submit" disabled={isPending} className="font-syne mt-2 h-[52px] w-full rounded-[10px] bg-[var(--brand)] text-[15px] font-[800] text-white transition-all hover:bg-[var(--brand-light)] disabled:cursor-not-allowed disabled:opacity-50">
              {isPending ? "Saving…" : "Continue →"}
            </button>
          </form>
        </div>
        <p className="mt-5 text-[13px] text-[var(--text-3)]">You can update these in your account settings later.</p>
      </div>
    </div>
  );
}
