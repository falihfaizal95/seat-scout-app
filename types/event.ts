export type Sport =
  | "NFL"
  | "NBA"
  | "MLB"
  | "NHL"
  | "MLS"
  | "NCAAF"
  | "NCAAB"
  | "UFC"
  | "Boxing"
  | "Tennis"
  | "Golf"
  | "Other";

export const SPORTS: Sport[] = [
  "NFL", "NBA", "MLB", "NHL", "MLS", "NCAAF", "NCAAB", "UFC", "Boxing", "Tennis", "Golf", "Other",
];

export const SPORT_EMOJIS: Record<Sport, string> = {
  NFL: "🏈", NBA: "🏀", MLB: "⚾", NHL: "🏒", MLS: "⚽",
  NCAAF: "🏈", NCAAB: "🏀", UFC: "🥊", Boxing: "🥊", Tennis: "🎾", Golf: "⛳", Other: "🎟️",
};

export interface NormalizedEvent {
  id: string;
  name: string;
  sport: Sport | string;
  segment?: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  venue: string;
  city: string;
  state?: string;
  country: string;
  eventDate: string;
  imageUrl?: string;
  lowestPrice?: number;
  averagePrice?: number;
  url?: string;
  source: string;
  externalIds: Record<string, string>;
}

export interface EventSearchParams {
  query: string;
  sport?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  limit?: number;
}
