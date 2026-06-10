"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ProtectedPage } from "@/components/protected-page";
import { apiFetch } from "@/lib/api";

type Dashboard = {
  verificationSummary: { total: number; verified: number; failed: number; suspicious: number };
  studentSummary: { total: number; pending: number; verified: number; review: number };
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void apiFetch<Dashboard>("/reports/dashboard").then((result) => {
      if (result.error) setError(result.error);
      if (result.data) setData(result.data);
    });
  }, []);

  const metrics = [
    ["Total Students", data?.studentSummary.total ?? 0],
    ["Verified", data?.verificationSummary.verified ?? 0],
    ["Failed", data?.verificationSummary.failed ?? 0],
    ["Suspicious", data?.verificationSummary.suspicious ?? 0]
  ];

  return (
    <ProtectedPage>
      <AdminShell title="Dashboard">
        {error ? <div className="card" style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</div> : null}
        <section className="grid metrics">
          {metrics.map(([label, value]) => (
            <div className="card" key={label}>
              <div className="muted">{label}</div>
              <div className="metric">{value}</div>
            </div>
          ))}
        </section>
        <section className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
          <div className="card">
            <h2>Verification Health</h2>
            <p className="muted">Live summary of authentication decisions across exam centers.</p>
            <div className="metric">{data?.verificationSummary.total ?? 0}</div>
          </div>
          <div className="card">
            <h2>Review Queue</h2>
            <p className="muted">Students needing manual investigation after mismatches or repeat failures.</p>
            <div className="metric">{data?.studentSummary.review ?? 0}</div>
          </div>
        </section>
      </AdminShell>
    </ProtectedPage>
  );
}
