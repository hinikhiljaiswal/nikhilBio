export default function NotFound() {
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
        <h1 style={{ fontSize: "28px", margin: "0 0 12px" }}>Page not found</h1>
        <p style={{ color: "#64748b", lineHeight: 1.5, margin: "0 0 20px" }}>
          The page you are looking for does not exist.
        </p>
        <a
          href="/dashboard"
          style={{
            background: "#2563eb",
            borderRadius: "6px",
            color: "#ffffff",
            display: "inline-block",
            fontWeight: 700,
            padding: "10px 14px",
            textDecoration: "none"
          }}
        >
          Go to dashboard
        </a>
      </section>
    </main>
  );
}
