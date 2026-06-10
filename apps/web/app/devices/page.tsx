import { ResourcePage } from "@/components/resource-page";

export default function DevicesPage() {
  return (
    <ResourcePage
      title="Devices"
      endpoint="/devices"
      columns={["serialNumber", "type", "vendor", "status", "lastSeenAt"]}
      fields={[
        { name: "serialNumber", label: "Serial Number", required: true },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { label: "Fingerprint", value: "FINGERPRINT" },
            { label: "Iris", value: "IRIS" },
            { label: "Face", value: "FACE" },
            { label: "Tablet", value: "TABLET" }
          ]
        },
        { name: "vendor", label: "Vendor", required: true },
        { name: "centerId", label: "Center ID", required: true },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Online", value: "ONLINE" },
            { label: "Offline", value: "OFFLINE" },
            { label: "Maintenance", value: "MAINTENANCE" }
          ]
        }
      ]}
    />
  );
}
