"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--card-border)] bg-[rgba(10,11,20,0.85)] backdrop-blur-[16px]">
        <div className="flex w-full items-center justify-between px-6 py-5 sm:px-[60px]">

          <Link href="/" className="font-syne text-[22px] font-[800] tracking-[-0.5px] text-[var(--text-1)]">
            Seat<span className="text-[var(--brand)]">Scout</span>
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            <li>
              <Link href="/#how-it-works" className="font-syne text-[14px] font-[600] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/#results" className="font-syne text-[14px] font-[600] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">
                Compare Prices
              </Link>
            </li>
            <li>
              <Link href="/faq" className="font-syne text-[14px] font-[600] text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]">
                FAQ
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            {isLoaded && isSignedIn ? (
              <UserButton
                appearance={{
                  elements: { avatarBox: "w-8 h-8 ring-2 ring-[var(--brand)]/40" },
                }}
              />
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="font-syne hidden text-[17px] font-[700] text-white transition-colors hover:text-[var(--text-2)] md:block"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center rounded-[8px] border border-[var(--card-border)] p-2 text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[rgba(10,11,20,0.98)] pt-[74px] backdrop-blur-[20px] md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-6">
            {[
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/search", label: "Compare Prices" },
              { href: "/faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-syne block rounded-[12px] px-4 py-4 text-[22px] font-[700] text-[var(--text-1)] transition-colors hover:bg-[var(--card)] hover:text-[var(--brand-light)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-6">
            <hr className="border-[var(--card-border)]" />
          </div>

          {isLoaded && !isSignedIn && (
            <div className="px-6 py-6">
              <button
                onClick={() => { setMobileOpen(false); router.push("/sign-in"); }}
                className="font-syne w-full rounded-[14px] bg-[var(--brand)] py-4 text-[17px] font-[700] text-white transition-colors hover:bg-[var(--brand-light)]"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
