import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import Toaster from "@/components/admin/Toaster";
import Sidebar from "./Sidebar";
import { logout } from "../_actions/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const unread = await db.contactMessage.count({ where: { isRead: false } });

  return (
    <div className="admin-shell">
      <input type="checkbox" id="nav-toggle" className="nav-toggle" hidden />
      <Sidebar unread={unread} />
      <label htmlFor="nav-toggle" className="admin-backdrop" aria-hidden="true"></label>

      <div className="admin-main">
        <header className="admin-topbar">
          <label htmlFor="nav-toggle" className="btn btn-light d-lg-none" aria-label="Open menu">
            <i className="fa-solid fa-bars"></i>
          </label>
          <div className="ms-auto d-flex align-items-center gap-3">
            {/* Plain <a> so the public site loads with its own styles */}
            <a href="/" target="_blank" className="btn btn-light btn-sm">
              <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> View website
            </a>
            <span className="d-none d-sm-inline text-muted small">
              <i className="fa-regular fa-user me-1"></i>
              {user.name}
            </span>
            <form action={logout}>
              <button className="btn btn-outline-secondary btn-sm">Log out</button>
            </form>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
