import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <>
      <AdminHeader title="Messages" description="Sent through the contact forms on the website." />
      <div className="card">
        {messages.length === 0 ? (
          <div className="empty">
            <i className="fa-regular fa-envelope-open"></i>
            No messages yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className={m.isRead ? "" : "message-unread"}>
                    <td>
                      {!m.isRead && <span className="badge text-bg-warning me-2">New</span>}
                      {m.name}
                      <div className="small text-muted fw-normal">{m.email}</div>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: 360 }}>
                      {m.subject || <span className="text-muted fw-normal">{m.message.slice(0, 80)}</span>}
                    </td>
                    <td className="text-nowrap">{formatDate(m.createdAt)}</td>
                    <td className="text-end">
                      <Link href={`/admin/messages/${m.id}`} className="btn btn-outline-primary btn-sm">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
