import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, startOfToday } from "@/lib/utils";

export default async function DashboardPage() {
  const [user, news, upcoming, team, unread, messages] = await Promise.all([
    getCurrentUser(),
    db.newsPost.count(),
    db.event.count({ where: { startDate: { gte: startOfToday() } } }),
    db.teamMember.count(),
    db.contactMessage.count({ where: { isRead: false } }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { href: "/admin/news", label: "News posts", value: news, icon: "fa-regular fa-newspaper" },
    { href: "/admin/events", label: "Upcoming events", value: upcoming, icon: "fa-regular fa-calendar" },
    { href: "/admin/team", label: "Team members", value: team, icon: "fa-solid fa-users" },
    { href: "/admin/messages", label: "Unread messages", value: unread, icon: "fa-regular fa-envelope" },
  ];

  const quick = [
    { href: "/admin/news/new", label: "Write a news post", icon: "fa-regular fa-pen-to-square" },
    { href: "/admin/events/new", label: "Add an event", icon: "fa-regular fa-calendar-plus" },
    { href: "/admin/team/new", label: "Add a team member", icon: "fa-solid fa-user-plus" },
    { href: "/admin/pages", label: "Edit page text", icon: "fa-regular fa-file-lines" },
  ];

  return (
    <>
      <AdminHeader title={`Welcome, ${user?.name ?? "admin"}`} description="Manage everything on the AFENET website from here." />

      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.href} className="col-sm-6 col-xl-3">
            <Link href={s.href} className="card stat-card">
              <div className="stat-icon">
                <i className={s.icon}></i>
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Quick actions</h2>
              <div className="d-grid gap-2">
                {quick.map((q) => (
                  <Link key={q.href} href={q.href} className="btn btn-light text-start">
                    <i className={`${q.icon} me-2`}></i> {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 m-0">Latest messages</h2>
                <Link href="/admin/messages" className="small">
                  View all
                </Link>
              </div>
              {messages.length === 0 ? (
                <div className="empty">
                  <i className="fa-regular fa-envelope-open"></i>
                  No messages yet. Messages sent through the website contact form appear here.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {messages.map((m) => (
                    <Link key={m.id} href={`/admin/messages/${m.id}`} className="list-group-item list-group-item-action px-0">
                      <div className="d-flex justify-content-between">
                        <span className={m.isRead ? "" : "fw-bold"}>
                          {!m.isRead && <span className="badge text-bg-warning me-2">New</span>}
                          {m.name}
                        </span>
                        <small className="text-muted">{formatDate(m.createdAt)}</small>
                      </div>
                      <div className="text-muted small text-truncate">{m.subject || m.message}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
