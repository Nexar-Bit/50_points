import HomePageClient from './HomePageClient';
import { mapTournamentForHomeCard } from '@/frontend/lib/api/mappers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PRODUCTION_API = 'https://five0-points-backend.onrender.com';
const initialTournaments = raw.map(mapTournamentForHomeCard);

async function fetchHomeTournaments() {
  const base = (
    process.env.API_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    PRODUCTION_API
  ).replace(/\/$/, '');

  try {
    const res = await fetch(`${base}/api/tournaments?for_home=1`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.tournaments) ? data.tournaments : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const raw = await fetchHomeTournaments();
  const initialTournaments = raw.map(mapTournamentForHomeCard);

  return <HomePageClient initialTournaments={initialTournaments} />;
}
