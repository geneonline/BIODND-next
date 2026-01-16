import DrugDetailClient from "./DrugDetailClient";

export default function DrugDetailPage({ params }: { params: { id: string } }) {
  // Decode the ID if it was encoded in the URL (e.g. specialized chars)
  const id = decodeURIComponent(params.id);

  return <DrugDetailClient id={id} />;
}
