/**
 * Major North American pro teams, used to turn a nickname search like
 * "hawks" into an exact Ticketmaster query ("Atlanta Hawks", NBA) instead of
 * a loose keyword match that also pulls in college and minor-league teams.
 */

export type League = "NBA" | "NFL" | "MLB" | "NHL";

export interface ProTeam {
  name: string;   // Exactly as Ticketmaster lists the attraction
  league: League;
}

const TEAMS: Record<League, string[]> = {
  NBA: [
    "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls",
    "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons",
    "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers",
    "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks",
    "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
    "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns",
    "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors",
    "Utah Jazz", "Washington Wizards",
  ],
  NFL: [
    "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
    "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
    "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
    "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
    "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
    "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
    "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
    "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders",
  ],
  MLB: [
    "Arizona Diamondbacks", "Athletics", "Atlanta Braves", "Baltimore Orioles",
    "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds",
    "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros",
    "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins",
    "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees",
    "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres",
    "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays",
    "Texas Rangers", "Toronto Blue Jays", "Washington Nationals",
  ],
  NHL: [
    "Anaheim Ducks", "Boston Bruins", "Buffalo Sabres", "Calgary Flames",
    "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche",
    "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers",
    "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens",
    "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers",
    "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks",
    "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs",
    "Utah Mammoth", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals",
    "Winnipeg Jets",
  ],
};

// Common shorthand → the words it stands for
const ALIASES: Record<string, string> = {
  mavs: "mavericks", cavs: "cavaliers", sixers: "76ers", wolves: "timberwolves",
  blazers: "trail blazers", niners: "49ers", bucs: "buccaneers", pats: "patriots",
  "d-backs": "diamondbacks", dbacks: "diamondbacks", habs: "canadiens", leafs: "maple leafs",
  caps: "capitals", pens: "penguins", nats: "nationals", yanks: "yankees",
  okc: "oklahoma city", ny: "new york", la: "los angeles", sf: "san francisco",
  "a's": "athletics",
};

const ALL_TEAMS: ProTeam[] = (Object.keys(TEAMS) as League[]).flatMap((league) =>
  TEAMS[league].map((name) => ({ name, league })),
);

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9'\- ]/g, " ").split(/\s+/).filter(Boolean);
// Split into words and expand shorthand, so "LA Clippers" and "los angeles clippers" compare equal
const expand = (s: string) => words(s).flatMap((w) => words(ALIASES[w] ?? w));

/** Max teams a single query may expand to before we fall back to a plain keyword search. */
const MAX_MATCHES = 6;

/**
 * Teams whose name contains every word of the query as a whole word
 * ("hawks" → Atlanta Hawks, but not Blackhawks or Seahawks).
 * Returns [] when nothing matches or the query is too broad.
 */
export function matchProTeams(query: string): ProTeam[] {
  const qWords = expand(query);
  if (!qWords.length || qWords.join("").length < 3) return [];

  const matches = ALL_TEAMS.filter((t) => {
    const tWords = expand(t.name);
    return qWords.every((w) => tWords.includes(w));
  });
  return matches.length <= MAX_MATCHES ? matches : [];
}
