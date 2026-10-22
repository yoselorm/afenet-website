import AdminHeader from "@/components/admin/AdminHeader";
import { TeamForm } from "@/components/admin/EntityForms";

export default function NewTeamMemberPage() {
  return (
    <>
      <AdminHeader title="Add team member" back={{ href: "/admin/team", label: "All team members" }} />
      <TeamForm />
    </>
  );
}
