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
  date: string;      // format "DD/MM"
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

async function fetchWeek(season: number, seasontype: number, week: number): Promise<any[]> {
  try {
    const url = `${BASE}/scoreboard?dates=${season}&seasontype=${seasontype}&week=${week}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

export async function getDolphinsSchedule(season: number): Promise<DolphinsGame[]> {
  try {
    // seasontype 1 = pré-saison (semaines 1 à 4), 2 = saison régulière (semaines 1 à 18)
    const weekPlans: Array<[number, number]> = [
      ...[1, 2, 3, 4].map((w): [number, number] => [1, w]),
      ...Array.from({ length: 18 }, (_, i): [number, number] => [2, i + 1]),
    ];

    const allEvents = (
      await Promise.all(weekPlans.map(([seasontype, week]) => fetchWeek(season, seasontype, week)))
    ).flat();

    const mia = allEvents.filter((event: any) =>
      event.competitions?.[0]?.competitors?.some((c: any) => c.team?.abbreviation === 'MIA')
    );

    return mia
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

export function getCurrentNflSeason(): number {
  const now = new Date();
  const month = now.getMonth() + 1;
  return month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}