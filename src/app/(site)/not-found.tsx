import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import { getContent } from "@/lib/content";

export default async function NotFound() {
  const home = await getContent("home");
  return (
    <>
      <PageHeader title="Page Not Found" image={home.hero.image} />
      <div className="error-page">
        <div className="container">
          <div className="row">
            <div className="error-page-image wow fadeInUp" data-wow-delay="0.25s">
              <img src="/theme/images/404-error-img.png" alt="" />
            </div>
            <div className="error-page-content">
              <div className="error-page-content-heading">
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Oops! page not found
                </h2>
              </div>
              <div className="error-page-content-body wow fadeInUp" data-wow-delay="0.25s">
                <p>We&apos;re sorry, but the page you&apos;re looking for doesn&apos;t exist.</p>
                <Link className="btn-default" href="/">
                  Back To Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
