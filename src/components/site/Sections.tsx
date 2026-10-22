import Link from "next/link";
import type { Content } from "@/lib/content-defaults";
import ContactForm from "./ContactForm";
import SectionTitle from "./SectionTitle";

export function CtaBox({ cta }: { cta: Content<"home">["cta"] }) {
  return (
    <div className="cta-box">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-8">
            <SectionTitle title={cta.title} text={cta.text} />
            {cta.buttonText && (
              <div className="section-btn wow fadeInUp" data-wow-delay="0.25s">
                <Link href={cta.buttonLink || "/contact"} className="btn-default btn-large">
                  {cta.buttonText}
                </Link>
              </div>
            )}
          </div>
          <div className="col-lg-5 col-md-4">
            {cta.image && (
              <div className="cta-box-image">
                <figure>
                  <img src={cta.image} alt="" />
                </figure>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Counters({ stats }: { stats: Content<"home">["stats"] }) {
  if (stats.length === 0) return null;
  return (
    <div className="row">
      {stats.map((stat, i) => (
        <div key={i} className="col-lg-3 col-6">
          <div className="company-counter-item">
            <div className="company-counter-content">
              <h3>
                <span className="counter">{stat.value}</span>
                {stat.suffix}
              </h3>
              <p>{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContactSection({
  settings,
  subtitle,
  title,
  image,
}: {
  settings: Content<"settings">;
  subtitle: string;
  title: string;
  image: string;
}) {
  return (
    <div className="contact-us">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-5">
            <div className="contact-sidebar wow fadeInUp" data-wow-delay="0.25s">
              <div className="contact-info">
                <div className="icon-box">
                  <img src="/theme/images/icon-phone.svg" alt="" />
                </div>
                <div className="contact-info-content">
                  <p>call us</p>
                  <h3>{settings.phone}</h3>
                </div>
              </div>
              <div className="contact-info">
                <div className="icon-box">
                  <img src="/theme/images/icon-mail.svg" alt="" />
                </div>
                <div className="contact-info-content">
                  <p>write to us</p>
                  <h3>{settings.email}</h3>
                </div>
              </div>
              {image && (
                <div className="contact-info-image">
                  <figure>
                    <img src={image} alt="" />
                  </figure>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-8 col-md-7">
            <div className="contact-form wow fadeInUp" data-wow-delay="0.25s">
              <SectionTitle subtitle={subtitle} title={title} />
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FocusAreas({ items }: { items: string[] }) {
  return (
    <div className="row">
      {items.map((item, i) => (
        <div key={i} className="col-lg-4 col-md-6">
          <div className="focus-area-item wow fadeInUp" data-wow-delay={`${(i % 3) * 0.2}s`}>
            <span className="focus-area-number">{String(i + 1).padStart(2, "0")}</span>
            <h3>{item}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null;
  const href = (p: number) => (p === 1 ? basePath : `${basePath}${basePath.includes("?") ? "&" : "?"}page=${p}`);
  return (
    <div className="post-pagination wow fadeInUp">
      <ul className="pagination">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} aria-label="Previous page">
              <i className="fa-solid fa-arrow-left-long"></i>
            </Link>
          </li>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <li key={p} className={p === page ? "active" : undefined}>
            <Link href={href(p)}>{p}</Link>
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link href={href(page + 1)} aria-label="Next page">
              <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
