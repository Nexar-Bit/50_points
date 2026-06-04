import { notFound } from "next/navigation";
import ModalityTicketsPanel from "@/frontend/components/modalities/ModalityTicketsPanel";
import { isValidModalityId } from "@/frontend/lib/gameModalities";

export default async function ModalityTicketsPage({ params }) {
  const { modalityId, trackSlug } = await params;
  if (!isValidModalityId(modalityId)) notFound();
  return <ModalityTicketsPanel modalityId={modalityId} trackSlugParam={trackSlug} />;
}
