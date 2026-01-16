import DeviceDetailClient from "./DeviceDetailClient";

export default function DeviceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  return <DeviceDetailClient id={id} />;
}
