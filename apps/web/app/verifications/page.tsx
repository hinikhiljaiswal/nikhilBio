import { ResourcePage } from "@/components/resource-page";

export default function VerificationsPage() {
  return (
    <ResourcePage
      title="Verifications"
      endpoint="/verifications"
      columns={["studentId", "deviceSerialNumber", "modality", "status", "matchScore", "capturedAt"]}
      readOnly
    />
  );
}
