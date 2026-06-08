import { notFound } from "next/navigation";
import ModalityTracksList from "@/frontend/components/modalities/ModalityTracksList";
import { getModality, isValidModalityId } from "@/frontend/lib/gameModalities";
import { buildPageMetadata } from "@/frontend/lib/seo/metadata";

const MODALITY_SEO = {
  guest: {
    title: "Available Racetracks",
    description:
      "Browse live horse racing tracks and enter free tournaments with no registration required on 50points.",
  },
  free: {
    title: "Free Racetracks",
    description:
      "Registered players get 3 free tickets per track. Pick a racetrack and compete in live tournaments.",
  },
  paid: {
    title: "Paid Racetracks",
    description: "Premium paid tournament racetracks on 50points.",
  },
  special: {
    title: "Special Event Racetracks",
    description: "Limited-season and special event racetracks on 50points.",
  },
};

export async function generateMetadata({ params }) {
  const { modalityId } = await params;
  if (!isValidModalityId(modalityId)) return {};

  const copy = MODALITY_SEO[modalityId] ?? {
    title: `${getModality(modalityId).badgeLabel} Racetracks`,
    description: "Select a racetrack to view tickets and enter the tournament on 50points.",
  };

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/modalidades/${modalityId}`,
    keywords: ["racetracks", "hipodromos", modalityId, "horse racing", "tournament"],
  });
}

export default async function ModalityTracksPage({ params }) {
  const { modalityId } = await params;
  if (!isValidModalityId(modalityId)) notFound();
  return <ModalityTracksList modalityId={modalityId} />;
}
