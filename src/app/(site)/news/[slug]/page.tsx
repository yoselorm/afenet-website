import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/site/PageHeader";
import SocialLinks from "@/components/site/SocialLinks";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

async function getPost(slug: string) {
  return db.newsPost.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {};
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const [post, settings] = await Promise.all([getPost((await params).slug), getContent("settings")]);
  if (!post) notFound();

  const tags = (post.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <>
      <PageHeader title={post.title}>
        <div className="post-single-meta wow fadeInUp">
          <ol className="breadcrumb">
            {post.author && (
              <li className="breadcrumb-item">
                <i className="fa-regular fa-user"></i> {post.author}
              </li>
            )}
            <li className="breadcrumb-item">
              <i className="fa-regular fa-clock"></i> {formatDate(post.publishedAt)}
            </li>
          </ol>
        </div>
      </PageHeader>

      <div className="page-single-post">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {post.coverImage && (
                <div className="post-image">
                  <figure className="image-anime reveal">
                    <img src={post.coverImage} alt={post.title} />
                  </figure>
                </div>
              )}

              <div className="post-content">
                {/* Content is sanitised when it is saved in the dashboard */}
                <div className="post-entry" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="post-tag-links">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      {tags.length > 0 && (
                        <div className="post-tags wow fadeInUp" data-wow-delay="0.5s">
                          <span className="tag-links">
                            Tags:
                            {tags.map((tag) => (
                              <a key={tag}>{tag}</a>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4">
                      <div className="post-social-sharing wow fadeInUp" data-wow-delay="0.5s">
                        <SocialLinks socials={settings.socials} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
