"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      style={{
        alignItems: "center",
        background: "#f6f8fb",
        color: "#0f172a",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px"
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
          maxWidth: "420px",
          padding: "28px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "28px", margin: "0 0 12px" }}>Something went wrong</h1>
        <p style={{ color: "#64748b", lineHeight: 1.5, margin: "0 0 20px" }}>
          The application hit an unexpected error.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "#2563eb",
              border: 0,
              borderRadius: "6px",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 700,
              padding: "10px 14px"
            }}
            type="button"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            style={{
              background: "#e5e7eb",
              borderRadius: "6px",
              color: "#0f172a",
              display: "inline-block",
              fontWeight: 700,
              padding: "10px 14px",
              textDecoration: "none"
            }}
          >
            Go to dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
