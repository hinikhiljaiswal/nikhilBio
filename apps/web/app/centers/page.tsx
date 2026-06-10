import { ResourcePage } from "@/components/resource-page";

export default function CentersPage() {
  return (
    <ResourcePage
      title="Centers"
      endpoint="/centers"
      columns={["name", "code", "city", "state", "isActive"]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "code", label: "Code", required: true },
        { name: "address", label: "Address", required: true },
        { name: "city", label: "City", required: true },
        { name: "state", label: "State", required: true },
        { name: "isActive", label: "Active", type: "checkbox" }
      ]}
    />
  );
}
