import AdminHeader from "@/components/admin/AdminHeader";
import { ConfirmForm } from "@/components/admin/FormBits";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteUser } from "../../_actions/users";
import { AddUserForm } from "./UserForms";

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <AdminHeader title="Admin users" description="People who can log in to this dashboard." />
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Added</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold">
                        {u.name} {u.id === me.id && <span className="badge text-bg-light">you</span>}
                      </td>
                      <td>{u.email}</td>
                      <td className="text-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="text-end">
                        {u.id !== me.id && (
                          <ConfirmForm action={deleteUser} id={u.id} message={`Remove ${u.name}'s access to the dashboard?`}>
                            Remove
                          </ConfirmForm>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-3">Add an admin</h2>
              <AddUserForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
