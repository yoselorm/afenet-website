import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Terms of Use" };

export default async function TermsOfUsePage() {
  const content = await getContent("terms");

  return (
    <>
      <PageHeader title={content.header.title} image={content.header.image} />
      <div className="page-single-post">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="post-content legal-content">
                {content.lastUpdated && <p className="legal-updated">Last updated: {content.lastUpdated}</p>}
                {/* Content is sanitised when it is saved in the dashboard */}
                <div className="post-entry" dangerouslySetInnerHTML={{ __html: content.body }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
