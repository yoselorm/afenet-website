"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { cleanHtml, excerpt, optional, str, stripHtml } from "@/lib/utils";
import { type FormState, parseDate, refreshSite, uniqueSlug } from "./shared";

export async function saveNews(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const id = Number(str(form, "id")) || undefined;
  const title = str(form, "title");
  const content = cleanHtml(str(form, "content"));
  if (!title) return { error: "Please enter a title." };
  if (!stripHtml(content)) return { error: "Please write some content." };

  const data = {
    title,
    slug: await uniqueSlug("newsPost", str(form, "slug") || title, id),
    excerpt: optional(form, "excerpt") ?? excerpt(stripHtml(content)),
    content,
    coverImage: optional(form, "coverImage"),
    author: optional(form, "author"),
    tags: optional(form, "tags"),
    published: form.get("published") === "on",
    publishedAt: parseDate(str(form, "publishedAt")) ?? new Date(),
  };

  if (id) {
    await db.newsPost.update({ where: { id }, data });
    refreshSite();
    return { ok: "News post saved." };
  }

  const post = await db.newsPost.create({ data });
  refreshSite();
  redirect(`/admin/news/${post.id}?created=1`);
}

export async function deleteNews(form: FormData) {
  await requireAdmin();
  await db.newsPost.delete({ where: { id: Number(str(form, "id")) } });
  refreshSite();
  redirect("/admin/news");
}
