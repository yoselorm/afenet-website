import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/logo-blue.png" alt="AFENET" />
        </div>
        <h1>Website dashboard</h1>
        <p className="text-muted mb-4">Log in to manage the AFENET website.</p>
        <LoginForm />
        {/* Full page load so the website's own styles are used */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="d-block text-center mt-4 small">
          ← Back to website
        </a>
      </div>
    </div>
  );
}
