"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { optional, str } from "@/lib/utils";
import { type FormState, refreshSite } from "./shared";

export async function saveTeamMember(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const id = Number(str(form, "id")) || undefined;
  const name = str(form, "name");
  const position = str(form, "position");
  if (!name || !position) return { error: "Please enter a name and position." };

  const data = {
    name,
    position,
    category: optional(form, "category"),
    photo: optional(form, "photo"),
    bio: optional(form, "bio"),
    email: optional(form, "email"),
    linkedin: optional(form, "linkedin"),
    twitter: optional(form, "twitter"),
    facebook: optional(form, "facebook"),
    sortOrder: Number(str(form, "sortOrder")) || 0,
    published: form.get("published") === "on",
  };

  if (id) {
    await db.teamMember.update({ where: { id }, data });
    refreshSite();
    return { ok: "Team member saved." };
  }

  const member = await db.teamMember.create({ data });
  refreshSite();
  redirect(`/admin/team/${member.id}?created=1`);
}

export async function deleteTeamMember(form: FormData) {
  await requireAdmin();
  await db.teamMember.delete({ where: { id: Number(str(form, "id")) } });
  refreshSite();
  redirect("/admin/team");
}
