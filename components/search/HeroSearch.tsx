"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const go = (q: string) => router.push(`/search?q=${encodeURIComponent(q)}`);

  return (
    <div className="mx-auto flex max-w-[780px] flex-col items-center w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="flex w-full items-center rounded-[24px] p-[6px] transition-shadow focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.9)",
          }}
        >
          <Search className="ml-4 size-5 shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />
          <input
            type="text"
            placeholder="Search for teams, games, or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[16px] sm:text-[17px] outline-none"
            style={{
              padding: "16px 14px",
              color: "#ffffff",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              caretColor: "#ffffff",
            }}
          />
          <button
            type="submit"
            className="font-syne shrink-0 rounded-[18px] font-[700] text-white transition-all hover:shadow-[0_6px_20px_rgba(124,106,247,0.45)] active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #7c6cff 0%, #9b8fff 100%)",
              padding: "16px 20px",
              fontSize: "15px",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
            }}
          >
            <span className="sm:hidden">Search →</span>
            <span className="hidden sm:inline">Search Deals</span>
          </button>
        </div>
      </form>

      <div className="flex w-full flex-wrap items-center justify-center gap-[10px]" style={{ marginTop: "20px" }}>
        <span className="mr-1 text-[13px] text-[var(--text-3)]">Popular:</span>
        {["Lakers", "Yankees", "Cowboys", "Warriors"].map((team) => (
          <button
            key={team}
            onClick={() => go(team)}
            className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-[14px] py-[6px] text-[13px] text-[var(--text-2)] transition-all hover:border-[rgba(124,106,247,0.3)] hover:bg-[var(--brand-dim)] hover:text-[var(--brand-light)]"
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
}
