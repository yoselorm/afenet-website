import Link from "next/link";
import { EventCard, NewsCard } from "@/components/site/Cards";
import SectionTitle from "@/components/site/SectionTitle";
import { ContactSection, Counters, CtaBox, FocusAreas } from "@/components/site/Sections";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import { startOfToday } from "@/lib/utils";

export default async function HomePage() {
  const [home, about, settings, upcoming, latestNews] = await Promise.all([
    getContent("home"),
    getContent("about"),
    getContent("settings"),
    db.event.findMany({
      where: { published: true, startDate: { gte: startOfToday() } },
      orderBy: { startDate: "asc" },
      take: 4,
    }),
    db.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  // Fall back to the most recent past events when nothing is coming up
  const events =
    upcoming.length > 0
      ? upcoming
      : await db.event.findMany({ where: { published: true }, orderBy: { startDate: "desc" }, take: 4 });

  const { hero } = home;

  return (
    <>
      {/* Hero */}
      <div className="hero bg-section parallaxie" style={{ backgroundImage: `url("${hero.image}")` }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="hero-content">
                <SectionTitle as="h1" subtitle={hero.subtitle} title={hero.title} text={hero.text} />
                <div className="hero-content-body wow fadeInUp" data-wow-delay="0.5s">
                  {hero.primaryText && (
                    <Link href={hero.primaryLink} className="btn-default">
                      {hero.primaryText}
                    </Link>
                  )}
                  {hero.secondaryText && (
                    <Link href={hero.secondaryLink} className="btn-default btn-highlighted">
                      {hero.secondaryText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="about-image">
                <div className="about-img">
                  <figure className="reveal">
                    <img src={home.about.image} alt="" />
                  </figure>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="about-content">
                <SectionTitle subtitle={home.about.subtitle} title={home.about.title} text={home.about.text} />
                {home.about.points.length > 0 && (
                  <div className="about-content-body wow fadeInUp" data-wow-delay="0.5s">
                    <ul>
                      {home.about.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="about-content-footer wow fadeInUp" data-wow-delay="0.75s">
                  {home.about.buttonText && (
                    <div className="about-footer-btn">
                      <Link href={home.about.buttonLink} className="btn-default">
                        {home.about.buttonText}
                      </Link>
                    </div>
                  )}
                  <div className="about-contact-support">
                    <div className="icon-box">
                      <img src="/theme/images/icon-mail.svg" alt="" />
                    </div>
                    <div className="about-support-content">
                      <p>write to us</p>
                      <h3>{settings.email}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What we do */}
      <div className="what-we-do-list">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <SectionTitle subtitle={home.whatWeDo.subtitle} title={home.whatWeDo.title} text={home.whatWeDo.text} />
            </div>
          </div>
          <FocusAreas items={about.whatWeDo.items} />
        </div>
      </div>

      {/* Numbers */}
      <div className="what-we-do">
        <div className="container">
          <Counters stats={home.stats} />
        </div>
      </div>

      {/* Events */}
      <div className="our-projects">
        <div className="light-bg-section">
          <div className="container-fluid">
            <div className="row section-row">
              <div className="col-lg-12">
                <SectionTitle subtitle={home.events.subtitle} title={home.events.title} text={home.events.text} />
              </div>
            </div>
            <div className="row">
              {events.length === 0 && <p className="empty-state">New events will be announced here soon.</p>}
              {events.map((event, i) => (
                <div key={event.id} className="col-lg-3 col-md-6">
                  <EventCard event={event} index={i} />
                </div>
              ))}
              <div className="project-footer-btn wow fadeInUp" data-wow-delay="1s">
                <Link href="/events" className="btn-default">
                  view all events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CtaBox cta={home.cta} />

      {/* News */}
      <div className="our-blog">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <SectionTitle subtitle={home.news.subtitle} title={home.news.title} text={home.news.text} />
            </div>
          </div>
          <div className="row">
            {latestNews.length === 0 && <p className="empty-state">News will be published here soon.</p>}
            {latestNews.map((post, i) => (
              <div key={post.id} className="col-lg-4 col-md-6">
                <NewsCard post={post} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ContactSection settings={settings} subtitle={home.contact.subtitle} title={home.contact.title} />
    </>
  );
}
