import { ResourcePage } from "@/components/resource-page";

export default function UsersPage() {
  return (
    <ResourcePage
      title="Users"
      endpoint="/users"
      columns={["name", "email", "role", "centerId", "isActive"]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true, placeholder: "Minimum 10 characters" },
        {
          name: "role",
          label: "Role",
          type: "select",
          required: true,
          options: [
            { label: "Super Admin", value: "SUPER_ADMIN" },
            { label: "Center Admin", value: "CENTER_ADMIN" },
            { label: "Operator", value: "OPERATOR" }
          ]
        },
        { name: "centerId", label: "Center ID" }
      ]}
    />
  );
}
