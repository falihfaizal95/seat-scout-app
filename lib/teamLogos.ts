/**
 * Official logo and colour for every NBA, NFL, MLB and NHL team, keyed by the
 * team name exactly as Ticketmaster and ESPN list it (they match for all 124).
 * Generated from ESPN's team API on 2026-11-17; regenerate if a team rebrands.
 *
 * Everything that shows a team logo should get it from here, so a card can
 * only ever show the logo of the team named on it.
 */

export type League = "NBA" | "NFL" | "MLB" | "NHL";

/** A team as shown on a card: name, logo and colour (hex without "#"). */
export interface TeamBadge {
  name: string;
  logo?: string;
  color?: string;
}

export interface TeamInfo {
  league: League;
  abbr: string;
  color: string;   // hex, no '#'
  logo: string;
}

const TEAMS: Record<string, TeamInfo> = {
  // NBA
  "Atlanta Hawks": { league: "NBA", abbr: "ATL", color: "c8102e", logo: "https://a.espncdn.com/i/teamlogos/nba/500/atl.png" },
  "Boston Celtics": { league: "NBA", abbr: "BOS", color: "008348", logo: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png" },
  "Brooklyn Nets": { league: "NBA", abbr: "BKN", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png" },
  "Charlotte Hornets": { league: "NBA", abbr: "CHA", color: "008ca8", logo: "https://a.espncdn.com/i/teamlogos/nba/500/cha.png" },
  "Chicago Bulls": { league: "NBA", abbr: "CHI", color: "ce1141", logo: "https://a.espncdn.com/i/teamlogos/nba/500/chi.png" },
  "Cleveland Cavaliers": { league: "NBA", abbr: "CLE", color: "860038", logo: "https://a.espncdn.com/i/teamlogos/nba/500/cle.png" },
  "Dallas Mavericks": { league: "NBA", abbr: "DAL", color: "0064b1", logo: "https://a.espncdn.com/i/teamlogos/nba/500/dal.png" },
  "Denver Nuggets": { league: "NBA", abbr: "DEN", color: "0e2240", logo: "https://a.espncdn.com/i/teamlogos/nba/500/den.png" },
  "Detroit Pistons": { league: "NBA", abbr: "DET", color: "1d428a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/det.png" },
  "Golden State Warriors": { league: "NBA", abbr: "GS", color: "fdb927", logo: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png" },
  "Houston Rockets": { league: "NBA", abbr: "HOU", color: "ce0e2d", logo: "https://a.espncdn.com/i/teamlogos/nba/500/hou.png" },
  "Indiana Pacers": { league: "NBA", abbr: "IND", color: "0c2340", logo: "https://a.espncdn.com/i/teamlogos/nba/500/ind.png" },
  "LA Clippers": { league: "NBA", abbr: "LAC", color: "12173f", logo: "https://a.espncdn.com/i/teamlogos/nba/500/lac.png" },
  "Los Angeles Lakers": { league: "NBA", abbr: "LAL", color: "552583", logo: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png" },
  "Memphis Grizzlies": { league: "NBA", abbr: "MEM", color: "5d76a9", logo: "https://a.espncdn.com/i/teamlogos/nba/500/mem.png" },
  "Miami Heat": { league: "NBA", abbr: "MIA", color: "98002e", logo: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png" },
  "Milwaukee Bucks": { league: "NBA", abbr: "MIL", color: "00471b", logo: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png" },
  "Minnesota Timberwolves": { league: "NBA", abbr: "MIN", color: "266092", logo: "https://a.espncdn.com/i/teamlogos/nba/500/min.png" },
  "New Orleans Pelicans": { league: "NBA", abbr: "NO", color: "0a2240", logo: "https://a.espncdn.com/i/teamlogos/nba/500/no.png" },
  "New York Knicks": { league: "NBA", abbr: "NY", color: "1d428a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/ny.png" },
  "Oklahoma City Thunder": { league: "NBA", abbr: "OKC", color: "007ac1", logo: "https://a.espncdn.com/i/teamlogos/nba/500/okc.png" },
  "Orlando Magic": { league: "NBA", abbr: "ORL", color: "0150b5", logo: "https://a.espncdn.com/i/teamlogos/nba/500/orl.png" },
  "Philadelphia 76ers": { league: "NBA", abbr: "PHI", color: "1d428a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/phi.png" },
  "Phoenix Suns": { league: "NBA", abbr: "PHX", color: "29127a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png" },
  "Portland Trail Blazers": { league: "NBA", abbr: "POR", color: "e03a3e", logo: "https://a.espncdn.com/i/teamlogos/nba/500/por.png" },
  "Sacramento Kings": { league: "NBA", abbr: "SAC", color: "5a2d81", logo: "https://a.espncdn.com/i/teamlogos/nba/500/sac.png" },
  "San Antonio Spurs": { league: "NBA", abbr: "SA", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/sa.png" },
  "Toronto Raptors": { league: "NBA", abbr: "TOR", color: "d91244", logo: "https://a.espncdn.com/i/teamlogos/nba/500/tor.png" },
  "Utah Jazz": { league: "NBA", abbr: "UTAH", color: "4e008e", logo: "https://a.espncdn.com/i/teamlogos/nba/500/utah.png" },
  "Washington Wizards": { league: "NBA", abbr: "WSH", color: "e31837", logo: "https://a.espncdn.com/i/teamlogos/nba/500/wsh.png" },
  // NFL
  "Arizona Cardinals": { league: "NFL", abbr: "ARI", color: "a40227", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png" },
  "Atlanta Falcons": { league: "NFL", abbr: "ATL", color: "a71930", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png" },
  "Baltimore Ravens": { league: "NFL", abbr: "BAL", color: "29126f", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
  "Buffalo Bills": { league: "NFL", abbr: "BUF", color: "00338d", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
  "Carolina Panthers": { league: "NFL", abbr: "CAR", color: "0085ca", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/car.png" },
  "Chicago Bears": { league: "NFL", abbr: "CHI", color: "0b1c3a", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
  "Cincinnati Bengals": { league: "NFL", abbr: "CIN", color: "fb4f14", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
  "Cleveland Browns": { league: "NFL", abbr: "CLE", color: "472a08", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png" },
  "Dallas Cowboys": { league: "NFL", abbr: "DAL", color: "002a5c", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
  "Denver Broncos": { league: "NFL", abbr: "DEN", color: "0a2343", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/den.png" },
  "Detroit Lions": { league: "NFL", abbr: "DET", color: "0076b6", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
  "Green Bay Packers": { league: "NFL", abbr: "GB", color: "204e32", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png" },
  "Houston Texans": { league: "NFL", abbr: "HOU", color: "021018", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png" },
  "Indianapolis Colts": { league: "NFL", abbr: "IND", color: "003b75", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png" },
  "Jacksonville Jaguars": { league: "NFL", abbr: "JAX", color: "007487", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png" },
  "Kansas City Chiefs": { league: "NFL", abbr: "KC", color: "e31837", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png" },
  "Las Vegas Raiders": { league: "NFL", abbr: "LV", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png" },
  "Los Angeles Chargers": { league: "NFL", abbr: "LAC", color: "0080c6", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png" },
  "Los Angeles Rams": { league: "NFL", abbr: "LAR", color: "003594", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png" },
  "Miami Dolphins": { league: "NFL", abbr: "MIA", color: "008e97", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
  "Minnesota Vikings": { league: "NFL", abbr: "MIN", color: "4f2683", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
  "New England Patriots": { league: "NFL", abbr: "NE", color: "002a5c", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png" },
  "New Orleans Saints": { league: "NFL", abbr: "NO", color: "d3bc8d", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/no.png" },
  "New York Giants": { league: "NFL", abbr: "NYG", color: "003c7f", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png" },
  "New York Jets": { league: "NFL", abbr: "NYJ", color: "115740", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png" },
  "Philadelphia Eagles": { league: "NFL", abbr: "PHI", color: "06424d", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
  "Pittsburgh Steelers": { league: "NFL", abbr: "PIT", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png" },
  "San Francisco 49ers": { league: "NFL", abbr: "SF", color: "aa0000", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png" },
  "Seattle Seahawks": { league: "NFL", abbr: "SEA", color: "002a5c", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png" },
  "Tampa Bay Buccaneers": { league: "NFL", abbr: "TB", color: "bd1c36", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png" },
  "Tennessee Titans": { league: "NFL", abbr: "TEN", color: "4495d2", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png" },
  "Washington Commanders": { league: "NFL", abbr: "WSH", color: "5a1414", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png" },
  // MLB
  "Arizona Diamondbacks": { league: "MLB", abbr: "ARI", color: "aa182c", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/ari.png" },
  "Athletics": { league: "MLB", abbr: "ATH", color: "003831", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/ath.png" },
  "Atlanta Braves": { league: "MLB", abbr: "ATL", color: "0c2340", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/atl.png" },
  "Baltimore Orioles": { league: "MLB", abbr: "BAL", color: "df4601", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/bal.png" },
  "Boston Red Sox": { league: "MLB", abbr: "BOS", color: "0d2b56", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/bos.png" },
  "Chicago Cubs": { league: "MLB", abbr: "CHC", color: "0e3386", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/chc.png" },
  "Chicago White Sox": { league: "MLB", abbr: "CHW", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/chw.png" },
  "Cincinnati Reds": { league: "MLB", abbr: "CIN", color: "c6011f", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/cin.png" },
  "Cleveland Guardians": { league: "MLB", abbr: "CLE", color: "002b5c", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/cle.png" },
  "Colorado Rockies": { league: "MLB", abbr: "COL", color: "33006f", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/col.png" },
  "Detroit Tigers": { league: "MLB", abbr: "DET", color: "0a2240", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/det.png" },
  "Houston Astros": { league: "MLB", abbr: "HOU", color: "002d62", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/hou.png" },
  "Kansas City Royals": { league: "MLB", abbr: "KC", color: "004687", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/kc.png" },
  "Los Angeles Angels": { league: "MLB", abbr: "LAA", color: "ba0021", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/laa.png" },
  "Los Angeles Dodgers": { league: "MLB", abbr: "LAD", color: "005a9c", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png" },
  "Miami Marlins": { league: "MLB", abbr: "MIA", color: "00a3e0", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/mia.png" },
  "Milwaukee Brewers": { league: "MLB", abbr: "MIL", color: "13294b", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/mil.png" },
  "Minnesota Twins": { league: "MLB", abbr: "MIN", color: "031f40", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/min.png" },
  "New York Mets": { league: "MLB", abbr: "NYM", color: "002d72", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/nym.png" },
  "New York Yankees": { league: "MLB", abbr: "NYY", color: "132448", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png" },
  "Philadelphia Phillies": { league: "MLB", abbr: "PHI", color: "e81828", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/phi.png" },
  "Pittsburgh Pirates": { league: "MLB", abbr: "PIT", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/pit.png" },
  "San Diego Padres": { league: "MLB", abbr: "SD", color: "2f241d", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/sd.png" },
  "San Francisco Giants": { league: "MLB", abbr: "SF", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/sf.png" },
  "Seattle Mariners": { league: "MLB", abbr: "SEA", color: "005c5c", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/sea.png" },
  "St. Louis Cardinals": { league: "MLB", abbr: "STL", color: "be0a14", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png" },
  "Tampa Bay Rays": { league: "MLB", abbr: "TB", color: "092c5c", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/tb.png" },
  "Texas Rangers": { league: "MLB", abbr: "TEX", color: "003278", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/tex.png" },
  "Toronto Blue Jays": { league: "MLB", abbr: "TOR", color: "134a8e", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/tor.png" },
  "Washington Nationals": { league: "MLB", abbr: "WSH", color: "ab0003", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/wsh.png" },
  // NHL
  "Anaheim Ducks": { league: "NHL", abbr: "ANA", color: "fc4c02", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/ana.png" },
  "Boston Bruins": { league: "NHL", abbr: "BOS", color: "231f20", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/bos.png" },
  "Buffalo Sabres": { league: "NHL", abbr: "BUF", color: "00468b", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/buf.png" },
  "Calgary Flames": { league: "NHL", abbr: "CGY", color: "dd1a32", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/cgy.png" },
  "Carolina Hurricanes": { league: "NHL", abbr: "CAR", color: "e30426", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/car.png" },
  "Chicago Blackhawks": { league: "NHL", abbr: "CHI", color: "e31937", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/chi.png" },
  "Colorado Avalanche": { league: "NHL", abbr: "COL", color: "860038", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/col.png" },
  "Columbus Blue Jackets": { league: "NHL", abbr: "CBJ", color: "002d62", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/cbj.png" },
  "Dallas Stars": { league: "NHL", abbr: "DAL", color: "20864c", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/dal.png" },
  "Detroit Red Wings": { league: "NHL", abbr: "DET", color: "e30526", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/det.png" },
  "Edmonton Oilers": { league: "NHL", abbr: "EDM", color: "00205b", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/edm.png" },
  "Florida Panthers": { league: "NHL", abbr: "FLA", color: "e51937", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/fla.png" },
  "Los Angeles Kings": { league: "NHL", abbr: "LA", color: "121212", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/la.png" },
  "Minnesota Wild": { league: "NHL", abbr: "MIN", color: "124734", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/min.png" },
  "Montreal Canadiens": { league: "NHL", abbr: "MTL", color: "c41230", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/mtl.png" },
  "Nashville Predators": { league: "NHL", abbr: "NSH", color: "fdba31", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/nsh.png" },
  "New Jersey Devils": { league: "NHL", abbr: "NJ", color: "e30b2b", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/nj.png" },
  "New York Islanders": { league: "NHL", abbr: "NYI", color: "00529b", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/nyi.png" },
  "New York Rangers": { league: "NHL", abbr: "NYR", color: "0056ae", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png" },
  "Ottawa Senators": { league: "NHL", abbr: "OTT", color: "dd1a32", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/ott.png" },
  "Philadelphia Flyers": { league: "NHL", abbr: "PHI", color: "fe5823", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/phi.png" },
  "Pittsburgh Penguins": { league: "NHL", abbr: "PIT", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/pit.png" },
  "San Jose Sharks": { league: "NHL", abbr: "SJ", color: "00788a", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/sj.png" },
  "Seattle Kraken": { league: "NHL", abbr: "SEA", color: "000d33", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/sea.png" },
  "St. Louis Blues": { league: "NHL", abbr: "STL", color: "0070b9", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/stl.png" },
  "Tampa Bay Lightning": { league: "NHL", abbr: "TB", color: "003e7e", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/tb.png" },
  "Toronto Maple Leafs": { league: "NHL", abbr: "TOR", color: "003e7e", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/tor.png" },
  "Utah Mammoth": { league: "NHL", abbr: "UTAH", color: "000000", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/utah.png" },
  "Vancouver Canucks": { league: "NHL", abbr: "VAN", color: "003e7e", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/van.png" },
  "Vegas Golden Knights": { league: "NHL", abbr: "VGK", color: "344043", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/vgk.png" },
  "Washington Capitals": { league: "NHL", abbr: "WSH", color: "d71830", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/wsh.png" },
  "Winnipeg Jets": { league: "NHL", abbr: "WPG", color: "002d62", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/wpg.png" },
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const BY_NORM = new Map(Object.entries(TEAMS).map(([name, info]) => [norm(name), info]));

/** Logo/colour for a pro team by its full name ("Atlanta Hawks"), or undefined for anything else. */
export function teamInfo(name?: string | null): TeamInfo | undefined {
  return name ? BY_NORM.get(norm(name)) : undefined;
}

/** Both teams' logo badges, only when both are known pro teams (otherwise undefined). */
export function matchupBadges(home?: string | null, away?: string | null) {
  const h = teamInfo(home), a = teamInfo(away);
  if (!h || !a || !home || !away) return undefined;
  return {
    home: { name: home, logo: h.logo, color: h.color },
    away: { name: away, logo: a.logo, color: a.color },
  };
}
