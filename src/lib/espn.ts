const TEAM_ID = '15'; // Miami Dolphins
const BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

export interface DolphinsGame {
  week: string;
  type: 'pre' | 'reg' | 'post';
  opponent: string;
  stadium: string;
  location: string;
  logo: string;
  scorePhins: number;
  scoreOpp: number;
  result: 'W' | 'L' | 'T';
  date: string;      // format "DD/MM" pour coller à l'existant
  isoDate: string;
  completed: boolean;
}

function mapEvent(event: any): DolphinsGame | null {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const dolphins = comp.competitors?.find((c: any) => c.team?.abbreviation === 'MIA');
  const opponent = comp.competitors?.find((c: any) => c.team?.abbreviation !== 'MIA');
  if (!dolphins || !opponent) return null;

  const completed = comp.status?.type?.completed === true;
  const scorePhins = Number(dolphins.score ?? 0);
  const scoreOpp = Number(opponent.score ?? 0);

  let result: 'W' | 'L' | 'T' = 'T';
  if (completed) {
    result = scorePhins > scoreOpp ? 'W' : scorePhins < scoreOpp ? 'L' : 'T';
  }

  const isoDate = event.date;
  const dateFr = new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

  const seasonSlug = event.season?.slug;

  return {
    week: event.week?.number ? `Week ${event.week.number}` : (event.name ?? ''),
    type: seasonSlug === 'preseason' ? 'pre' : seasonSlug === 'postseason' ? 'post' : 'reg',
    opponent: opponent.team?.displayName ?? '',
    stadium: comp.venue?.fullName ?? '',
    location: comp.venue?.address
      ? [comp.venue.address.city, comp.venue.address.state].filter(Boolean).join(', ')
      : '',
    logo: opponent.team?.logo ?? '',
    scorePhins,
    scoreOpp,
    result,
    date: dateFr,
    isoDate,
    completed,
  };
}

export async function getDolphinsSchedule(season: number): Promise<DolphinsGame[]> {
  try {
    const res = await fetch(`${BASE}/teams/${TEAM_ID}/schedule?season=${season}`);
    if (!res.ok) throw new Error(`ESPN API ${res.status}`);
    const data = await res.json();
    const events = data.events ?? [];
    return events
      .map(mapEvent)
      .filter((g: DolphinsGame | null): g is DolphinsGame => g !== null)
      .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());
  } catch (err) {
    console.error('[espn] Impossible de récupérer le calendrier Dolphins :', err);
    return [];
  }
}

export async function getLastDolphinsGame(season: number): Promise<DolphinsGame | null> {
  const schedule = await getDolphinsSchedule(season);
  const played = schedule.filter((g) => g.completed);
  return played.length ? played[played.length - 1] : null;
}

// Utile pour ne pas coder l'année en dur : la saison NFL commence en août
export function getCurrentNflSeason(): number {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  return month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}