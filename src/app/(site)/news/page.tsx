import type { Metadata } from "next";
import { NewsCard } from "@/components/site/Cards";
import PageHeader from "@/components/site/PageHeader";
import { Pagination } from "@/components/site/Sections";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "News" };

const PER_PAGE = 9;

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const where = { published: true };

  const [content, posts, total] = await Promise.all([
    getContent("news"),
    db.newsPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.newsPost.count({ where }),
  ]);

  return (
    <>
      <PageHeader title={content.header.title} image={content.header.image} />

      <div className="page-blog">
        <div className="container">
          <div className="row">
            {posts.length === 0 && <p className="empty-state">No news has been published yet.</p>}
            {posts.map((post, i) => (
              <div key={post.id} className="col-lg-4 col-md-6">
                <NewsCard post={post} index={i} />
              </div>
            ))}
          </div>
          <div className="row">
            <div className="col-md-12">
              <Pagination page={page} totalPages={Math.ceil(total / PER_PAGE)} basePath="/news" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
