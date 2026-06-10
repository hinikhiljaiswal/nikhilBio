"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Building2, ClipboardCheck, FileText, Gauge, GraduationCap, LogOut, TabletSmartphone, Users } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/users", label: "Users", icon: Users },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/exams", label: "Exams", icon: ClipboardCheck },
  { href: "/centers", label: "Centers", icon: Building2 },
  { href: "/devices", label: "Devices", icon: TabletSmartphone },
  { href: "/verifications", label: "Verifications", icon: Activity },
  { href: "/reports", label: "Reports", icon: FileText }
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    window.localStorage.removeItem("accessToken");
    router.push("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">BioExam Verify</div>
        <nav className="nav">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{ background: pathname === item.href ? "rgba(255,255,255,.14)" : undefined }}>
                <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                  <Icon size={18} /> {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <div>
            <h1 style={{ margin: 0 }}>{title}</h1>
            <div className="muted">Secure exam center authentication and monitoring</div>
          </div>
          <button className="button" type="button" onClick={logout}>
            <LogOut size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
            Logout
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
