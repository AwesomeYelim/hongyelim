import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      gap: "16px",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)" }}>
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 24px",
          border: "1px solid var(--color-border-light)",
          borderRadius: "6px",
          color: "var(--color-text-primary)",
          fontWeight: 600,
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
