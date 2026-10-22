import AdminHeader from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/auth";
import { PasswordForm, ProfileForm } from "../users/UserForms";

export default async function AccountPage() {
  const me = await requireAdmin();
  return (
    <>
      <AdminHeader title="My account" description={me.email} />
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-3">Profile</h2>
              <ProfileForm name={me.name} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-3">Change password</h2>
              <PasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
