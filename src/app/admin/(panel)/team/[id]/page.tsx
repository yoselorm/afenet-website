import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { TeamForm } from "@/components/admin/EntityForms";
import { ConfirmForm } from "@/components/admin/FormBits";
import { db } from "@/lib/db";
import { deleteTeamMember } from "../../../_actions/team";

export default async function EditTeamMemberPage({ params, searchParams }: PageProps<"/admin/team/[id]">) {
  const member = await db.teamMember.findUnique({ where: { id: Number((await params).id) || 0 } });
  if (!member) notFound();
  const created = (await searchParams).created;

  return (
    <>
      <AdminHeader title="Edit team member" back={{ href: "/admin/team", label: "All team members" }} />
      {created && <div className="alert alert-success">Team member added.</div>}
      <TeamForm member={member} />
      <ConfirmForm action={deleteTeamMember} id={member.id} message={`Remove ${member.name} from the team? This cannot be undone.`}>
        <i className="fa-solid fa-trash me-1"></i> Delete member
      </ConfirmForm>
    </>
  );
}
