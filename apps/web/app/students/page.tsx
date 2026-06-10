import { ResourcePage } from "@/components/resource-page";

export default function StudentsPage() {
  return (
    <ResourcePage
      title="Students"
      endpoint="/students"
      columns={["name", "rollNumber", "aadhaarMasked", "verificationStatus"]}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "aadhaarNumber", label: "Aadhaar Number", required: true, placeholder: "12 digits" },
        { name: "rollNumber", label: "Roll Number", required: true },
        { name: "examId", label: "Exam ID", required: true },
        { name: "centerId", label: "Center ID", required: true },
        { name: "hasBiometricReference", label: "Has Biometric Reference", type: "checkbox" },
        {
          name: "verificationStatus",
          label: "Verification Status",
          type: "select",
          editOnly: true,
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "Verified", value: "VERIFIED" },
            { label: "Failed", value: "FAILED" },
            { label: "Review", value: "REVIEW" }
          ]
        }
      ]}
    />
  );
}
