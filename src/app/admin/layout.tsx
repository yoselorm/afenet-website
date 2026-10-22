import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | AFENET Dashboard" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&family=Manrope:wght@500..800&display=swap"
        precedence="admin"
      />
      <link rel="stylesheet" href="/theme/css/bootstrap.min.css" precedence="admin" />
      <link rel="stylesheet" href="/theme/css/all.css" precedence="admin" />
      <link rel="stylesheet" href="/theme/css/admin.css" precedence="admin" />
      {children}
    </>
  );
}
