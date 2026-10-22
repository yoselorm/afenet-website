"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { contentDefaults, isContentKey } from "@/lib/content-defaults";
import { db } from "@/lib/db";
import { str } from "@/lib/utils";
import { type FormState, refreshSite } from "./shared";

// Saves one page's editable content (sent from the dashboard as JSON)
export async function saveContent(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const key = str(form, "key");
  if (!isContentKey(key)) return { error: "Unknown page." };

  let value: unknown;
  try {
    value = JSON.parse(str(form, "value"));
  } catch {
    return { error: "Could not read the form data. Please try again." };
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { error: "Invalid content." };
  }

  // Only keep fields this page actually has
  const allowed = Object.keys(contentDefaults[key]);
  const clean = Object.fromEntries(Object.entries(value).filter(([k]) => allowed.includes(k)));

  await db.setting.upsert({
    where: { key },
    create: { key, value: clean },
    update: { value: clean },
  });
  refreshSite();
  return { ok: "Changes saved. They are now live on the website." };
}

export async function resetContent(form: FormData) {
  await requireAdmin();
  const key = str(form, "key");
  if (!isContentKey(key)) return;
  await db.setting.deleteMany({ where: { key } });
  refreshSite();
  redirect(`/admin/pages/${key}?reset=${Date.now()}`);
}
