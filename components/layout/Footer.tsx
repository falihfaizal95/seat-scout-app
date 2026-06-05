import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--bg-1)] px-6 pb-10 pt-[72px] sm:px-[60px]">
      <div className="mb-[60px] grid gap-[60px] md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <div className="font-syne text-[22px] font-[800] tracking-[-0.5px] text-[var(--text-1)]">
            Seat<span className="text-[var(--brand)]">Scout</span>
          </div>
          <p className="mt-4 max-w-[260px] text-[14px] leading-[1.75] text-[var(--text-2)]">
            Compare ticket prices across all major platforms and never overpay for seats again.
          </p>
        </div>
        <div>
          <h4 className="font-syne mb-5 text-[13px] font-[700] uppercase tracking-[0.5px] text-[var(--text-3)]">Product</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/#how-it-works" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">How It Works</Link></li>
            <li><Link href="/search" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">Compare Prices</Link></li>
            <li><Link href="/faq" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-syne mb-5 text-[13px] font-[700] uppercase tracking-[0.5px] text-[var(--text-3)]">Sports</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/sports/nba" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">NBA</Link></li>
            <li><Link href="/sports/nfl" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">NFL</Link></li>
            <li><Link href="/sports/mlb" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">MLB</Link></li>
            <li><Link href="/sports/nhl" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">NHL</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-syne mb-5 text-[13px] font-[700] uppercase tracking-[0.5px] text-[var(--text-3)]">Company</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/about" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">About Us</Link></li>
            <li><Link href="/contact" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">Contact</Link></li>
            <li><Link href="/privacy" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-[14px] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--card-border)] pt-7">
        <p className="text-[13px] text-[var(--text-3)]">© {new Date().getFullYear()} SeatScout. All rights reserved.</p>
        <p className="text-[13px] text-[var(--text-3)]">Prices are updated in real-time from official ticket platforms</p>
      </div>
    </footer>
  );
}
