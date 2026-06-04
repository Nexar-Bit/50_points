import { notFound } from "next/navigation";
import ModalityTracksList from "@/frontend/components/modalities/ModalityTracksList";
import { isValidModalityId } from "@/frontend/lib/gameModalities";

export default async function ModalityTracksPage({ params }) {
  const { modalityId } = await params;
  if (!isValidModalityId(modalityId)) notFound();
  return <ModalityTracksList modalityId={modalityId} />;
}
