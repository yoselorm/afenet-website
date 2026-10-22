"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { cleanHtml, optional, str } from "@/lib/utils";
import { type FormState, parseDate, refreshSite, uniqueSlug } from "./shared";

export async function saveEvent(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const id = Number(str(form, "id")) || undefined;
  const title = str(form, "title");
  const startDate = parseDate(str(form, "startDate"));
  const endDate = parseDate(str(form, "endDate"));
  if (!title) return { error: "Please enter a title." };
  if (!startDate) return { error: "Please choose a start date." };
  if (endDate && endDate < startDate) return { error: "The end date can't be before the start date." };

  const registrationUrl = optional(form, "registrationUrl");
  if (registrationUrl && !/^https?:\/\//.test(registrationUrl)) {
    return { error: "The registration link must start with http:// or https://" };
  }

  const data = {
    title,
    slug: await uniqueSlug("event", str(form, "slug") || title, id),
    summary: optional(form, "summary"),
    content: cleanHtml(str(form, "content")),
    coverImage: optional(form, "coverImage"),
    location: optional(form, "location"),
    startDate,
    endDate,
    registrationUrl,
    published: form.get("published") === "on",
  };

  if (id) {
    await db.event.update({ where: { id }, data });
    refreshSite();
    return { ok: "Event saved." };
  }

  const event = await db.event.create({ data });
  refreshSite();
  redirect(`/admin/events/${event.id}?created=1`);
}

export async function deleteEvent(form: FormData) {
  await requireAdmin();
  await db.event.delete({ where: { id: Number(str(form, "id")) } });
  refreshSite();
  redirect("/admin/events");
}
