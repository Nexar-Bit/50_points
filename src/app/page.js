import HomePageClient from './HomePageClient';
import { mapTournamentForHomeCard } from '@/frontend/lib/api/mappers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PRODUCTION_API = 'https://five0-points-backend.onrender.com';

async function fetchHomeTournaments() {
  // ...
}

export default async function Home() {
  const raw = await fetchHomeTournaments();
  const initialTournaments = raw.map(mapTournamentForHomeCard);
  return <HomePageClient initialTournaments={initialTournaments} />;
}