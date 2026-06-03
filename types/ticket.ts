export type Platform =
  | "ticketmaster"
  | "seatgeek"
  | "stubhub"
  | "vividseats"
  | "axs"
  | "gametime"
  | "tickpick";

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
  bgColor: string;
  logo?: string;
}

export const PLATFORM_INFO: Record<Platform, PlatformInfo> = {
  ticketmaster: {
    id: "ticketmaster",
    name: "Ticketmaster",
    color: "#026CDF",
    bgColor: "#EBF3FE",
    logo: "/logos/ticketmaster.svg",
  },
  seatgeek: {
    id: "seatgeek",
    name: "SeatGeek",
    color: "#05C053",
    bgColor: "#E6FAF0",
    logo: "/logos/seatgeek.svg",
  },
  stubhub: {
    id: "stubhub",
    name: "StubHub",
    color: "#FF5C00",
    bgColor: "#FFF0E6",
    logo: "/logos/stubhub.svg",
  },
  vividseats: {
    id: "vividseats",
    name: "Vivid Seats",
    color: "#6B21A8",
    bgColor: "#F3E8FF",
    logo: "/logos/vividseats.svg",
  },
  axs: {
    id: "axs",
    name: "AXS",
    color: "#E31837",
    bgColor: "#FEE8EC",
    logo: "/logos/axs.svg",
  },
  gametime: {
    id: "gametime",
    name: "Gametime",
    color: "#FF6B00",
    bgColor: "#FFF3E6",
    logo: "/logos/gametime.svg",
  },
  tickpick: {
    id: "tickpick",
    name: "TickPick",
    color: "#1DB5BE",
    bgColor: "#E6F8F9",
    logo: "/logos/tickpick.svg",
  },
};

export interface TicketListing {
  id: string;
  platform: Platform;
  eventId: string;
  externalEventId: string;
  section: string;
  row: string | null;
  quantity: number;
  pricePerTicket: number;
  totalPrice: number;
  currency: string;
  buyUrl: string;
  listingFetchedAt: Date;
  isVerified?: boolean;
  isMock?: boolean;
}

export interface AggregatedTickets {
  eventId: string;
  listings: TicketListing[];
  lowestPrice: number | null;
  averagePrice: number | null;
  platformsAvailable: Platform[];
  fetchedAt: Date;
  fromCache: boolean;
}
