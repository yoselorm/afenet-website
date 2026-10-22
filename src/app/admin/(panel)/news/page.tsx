import Link from "next/link";
import AdminHeader, { SearchBox, StatusBadge } from "@/components/admin/AdminHeader";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminNewsPage({ searchParams }: PageProps<"/admin/news">) {
  const q = String((await searchParams).q ?? "").trim();
  const posts = await db.newsPost.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { publishedAt: "desc" },
    take: 200,
  });

  return (
    <>
      <AdminHeader title="News" description="Articles shown on the News page and the home page." action={{ href: "/admin/news/new", label: "New post" }} />
      <SearchBox q={q} placeholder="Search news…" />
      <div className="card">
        {posts.length === 0 ? (
          <div className="empty">
            <i className="fa-regular fa-newspaper"></i>
            {q ? "No posts match your search." : "No news posts yet."}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ width: 72 }}>
                      {post.coverImage ? <img src={post.coverImage} alt="" className="table-thumb" /> : <div className="table-thumb" />}
                    </td>
                    <td>
                      <Link href={`/admin/news/${post.id}`} className="fw-semibold text-decoration-none">
                        {post.title}
                      </Link>
                    </td>
                    <td><StatusBadge on={post.published} /></td>
                    <td className="text-nowrap">{formatDate(post.publishedAt)}</td>
                    <td className="text-end text-nowrap">
                      {post.published && (
                        <a href={`/news/${post.slug}`} target="_blank" className="btn btn-light btn-sm me-1" title="View on website">
                          <i className="fa-solid fa-eye"></i>
                        </a>
                      )}
                      <Link href={`/admin/news/${post.id}`} className="btn btn-outline-primary btn-sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
