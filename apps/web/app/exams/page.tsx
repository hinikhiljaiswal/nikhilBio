import { ResourcePage } from "@/components/resource-page";

export default function ExamsPage() {
  return (
    <ResourcePage
      title="Exams"
      endpoint="/exams"
      columns={["name", "code", "status", "startsAt", "endsAt"]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "code", label: "Code", required: true },
        { name: "startsAt", label: "Starts At", type: "datetime-local", required: true },
        { name: "endsAt", label: "Ends At", type: "datetime-local", required: true },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Draft", value: "DRAFT" },
            { label: "Active", value: "ACTIVE" },
            { label: "Closed", value: "CLOSED" }
          ]
        }
      ]}
    />
  );
}
