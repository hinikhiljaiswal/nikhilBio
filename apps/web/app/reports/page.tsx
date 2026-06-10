"use client";

import { AdminShell } from "@/components/admin-shell";
import { ProtectedPage } from "@/components/protected-page";
import { getToken } from "@/lib/api";

export default function ReportsPage() {
  async function exportCsv() {
    const token = getToken();
    const response = await fetch("/api/reports/verifications.csv", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "verifications.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <ProtectedPage>
      <AdminShell title="Reports">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Verification Export</h2>
          <p className="muted">Download center-wise verification records for audit and compliance review.</p>
          <button className="button" type="button" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </AdminShell>
    </ProtectedPage>
  );
}
