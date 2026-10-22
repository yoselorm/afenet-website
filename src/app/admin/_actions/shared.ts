import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export type FormState = { ok?: string; error?: string } | null;

// Makes "my-title", "my-title-2", … so two items never share a URL
export async function uniqueSlug(model: "newsPost" | "event", source: string, excludeId?: number) {
  const base = slugify(source) || "item";
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const where = { slug, NOT: excludeId ? { id: excludeId } : undefined };
    const exists =
      model === "newsPost" ? await db.newsPost.findFirst({ where }) : await db.event.findFirst({ where });
    if (!exists) return slug;
  }
}

// "2026-10-22" from a date input → Date at local midnight
export function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Content changed: refresh every public page
export function refreshSite() {
  revalidatePath("/", "layout");
}
