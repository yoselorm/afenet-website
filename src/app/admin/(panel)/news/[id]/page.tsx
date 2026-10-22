import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { NewsForm } from "@/components/admin/EntityForms";
import { ConfirmForm } from "@/components/admin/FormBits";
import { db } from "@/lib/db";
import { deleteNews } from "../../../_actions/news";

export default async function EditNewsPage({ params, searchParams }: PageProps<"/admin/news/[id]">) {
  const post = await db.newsPost.findUnique({ where: { id: Number((await params).id) || 0 } });
  if (!post) notFound();
  const created = (await searchParams).created;

  return (
    <>
      <AdminHeader title="Edit news post" back={{ href: "/admin/news", label: "All news" }} />
      {created && <div className="alert alert-success">Post created.</div>}
      <NewsForm post={post} />
      <div className="d-flex gap-2">
        {post.published && (
          <a href={`/news/${post.slug}`} target="_blank" className="btn btn-light btn-sm">
            <i className="fa-solid fa-eye me-1"></i> View on website
          </a>
        )}
        <ConfirmForm action={deleteNews} id={post.id} message="Delete this news post? This cannot be undone.">
          <i className="fa-solid fa-trash me-1"></i> Delete post
        </ConfirmForm>
      </div>
    </>
  );
}
