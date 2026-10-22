"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { str } from "@/lib/utils";

export async function setMessageRead(form: FormData) {
  await requireAdmin();
  const isRead = str(form, "isRead") === "true";
  await db.contactMessage.update({ where: { id: Number(str(form, "id")) }, data: { isRead } });
  revalidatePath("/admin", "layout");
  // Back to the inbox, since re-opening the message would mark it read again
  if (!isRead) redirect("/admin/messages");
}

export async function deleteMessage(form: FormData) {
  await requireAdmin();
  await db.contactMessage.delete({ where: { id: Number(str(form, "id")) } });
  revalidatePath("/admin", "layout");
  redirect("/admin/messages");
}
