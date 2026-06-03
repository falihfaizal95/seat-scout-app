import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { Syne, DM_Sans, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeatScout – Find the Cheapest Sports Tickets",
  description:
    "Compare ticket prices across Ticketmaster, StubHub, SeatGeek, Vivid Seats, AXS and more. Find the best seats for any game at the lowest price.",
  keywords: ["sports tickets", "cheap tickets", "ticketmaster", "stubhub", "seatgeek", "compare tickets"],
  openGraph: {
    title: "SeatScout – Find the Cheapest Sports Tickets",
    description: "The Kayak for sports tickets. Compare prices across every platform instantly.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#6d6ae8",
          colorBackground: "#0d0d10",
          colorInputBackground: "#18181f",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#8b8ba7",
          colorNeutral: "#8b8ba7",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
        },
        elements: {
          card: "bg-[#111118] border border-white/[0.08] shadow-2xl",
          headerTitle: "text-white font-black",
          headerSubtitle: "text-[#8b8ba7]",
          socialButtonsBlockButton: "border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white",
          formFieldInput: "bg-[#18181f] border-white/[0.1] text-white focus:border-[#6d6ae8]/60",
          formButtonPrimary: "bg-[#6d6ae8] hover:bg-[#7b79f0]",
          footerActionLink: "text-[#7b79f0] hover:text-white",
          dividerLine: "bg-white/[0.07]",
          dividerText: "text-[#4a4a6a]",
          formFieldLabel: "text-[#8b8ba7] text-xs uppercase tracking-wider font-semibold",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-[#7b79f0]",
        },
      }}
    >
      <html lang="en" className={`dark ${syne.variable} ${dmSans.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
        <body className="w-full">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
