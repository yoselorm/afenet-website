import Link from "next/link";
import AdminHeader, { StatusBadge } from "@/components/admin/AdminHeader";
import { db } from "@/lib/db";

export default async function AdminTeamPage() {
  const members = await db.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });

  return (
    <>
      <AdminHeader title="Team" description="People shown on the Our Team page, in display order." action={{ href: "/admin/team/new", label: "Add member" }} />
      <div className="card">
        {members.length === 0 ? (
          <div className="empty">
            <i className="fa-solid fa-users"></i>
            No team members yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Group</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td style={{ width: 58 }}>
                      {m.photo ? <img src={m.photo} alt="" className="table-avatar" /> : <div className="table-avatar bg-light" />}
                    </td>
                    <td>
                      <Link href={`/admin/team/${m.id}`} className="fw-semibold text-decoration-none">
                        {m.name}
                      </Link>
                    </td>
                    <td>{m.position}</td>
                    <td className="text-muted">{m.category}</td>
                    <td>{m.sortOrder}</td>
                    <td><StatusBadge on={m.published} onLabel="Visible" offLabel="Hidden" /></td>
                    <td className="text-end">
                      <Link href={`/admin/team/${m.id}`} className="btn btn-outline-primary btn-sm">
                        Edit
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
