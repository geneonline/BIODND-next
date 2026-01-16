import ClinicalTrialDetailClient from "./ClinicalTrialDetailClient";

export default function ClinicalTrialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  return <ClinicalTrialDetailClient id={id} />;
}
