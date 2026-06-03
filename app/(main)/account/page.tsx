import { BookmarkIcon, Bell, History, ChevronRight, Ticket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function AccountPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen pt-24 pb-20 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[var(--brand)] blur-xl opacity-30" />
            {user?.imageUrl ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[var(--brand)]/30">
                <Image src={user.imageUrl} alt="Avatar" fill className="object-cover" />
              </div>
            ) : (
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#4542b8] flex items-center justify-center text-2xl">
                {user ? (
                  <span className="text-white font-bold text-xl">
                    {(user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress[0] ?? "?").toUpperCase()}
                  </span>
                ) : (
                  <span>👤</span>
                )}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              {user ? (user.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}` : "My Account") : "My Account"}
            </h1>
            <p className="text-sm text-[var(--text-2)]">
              {user?.emailAddresses[0]?.emailAddress ?? "Saved events and price alerts"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Saved", value: "0", icon: BookmarkIcon, color: "var(--brand-light)" },
            { label: "Alerts", value: "0", icon: Bell, color: "var(--brand)" },
            { label: "Searches", value: "0", icon: History, color: "#f59e0b" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl border border-white/[0.07] bg-[var(--bg-1)] text-center"
            >
              <s.icon size={18} className="mx-auto mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[11px] text-[var(--text-3)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav cards */}
        <div className="space-y-2 mb-8">
          {[
            { href: "/account/saved", icon: BookmarkIcon, label: "Saved Events", desc: "Events you've bookmarked", color: "var(--brand)" },
            { href: "/account/alerts", icon: Bell, label: "Price Alerts", desc: "Get notified when prices drop", color: "var(--brand)" },
            { href: "/search", icon: Ticket, label: "Find Tickets", desc: "Search upcoming events", color: "#f59e0b" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-5 rounded-2xl border border-white/[0.07] bg-[var(--bg-1)] hover:border-white/[0.15] hover:bg-[var(--bg-2)] transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
              >
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{item.label}</p>
                <p className="text-xs text-[var(--text-3)]">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--text-3)] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {!user && (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[var(--bg-1)] p-6 text-center">
            <p className="text-sm text-[var(--text-2)] mb-4">
              Sign in to save events and receive price drop alerts.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/[0.1] text-[var(--text-2)] hover:text-white hover:border-white/[0.2] transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--brand)] hover:bg-[var(--brand-light)] text-white transition-all glow-brand"
              >
                Create account
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
