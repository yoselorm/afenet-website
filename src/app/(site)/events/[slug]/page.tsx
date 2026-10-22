import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/site/PageHeader";
import { db } from "@/lib/db";
import { formatEventDates, startOfToday } from "@/lib/utils";

async function getEvent(slug: string) {
  return db.event.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return event ? { title: event.title, description: event.summary ?? undefined } : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const upcoming = event.startDate >= startOfToday();

  return (
    <>
      <PageHeader title={event.title} crumbs={[{ label: "events", href: "/events" }]} />

      <div className="page-single-post">
        <div className="container">
          <div className="row">
            {event.coverImage && (
              <div className="col-lg-5">
                {/* Same 4:5 shape as the event cards, so one crop works for both */}
                <div className="event-cover">
                  <figure className="image-anime reveal">
                    <img src={event.coverImage} alt={event.title} />
                  </figure>
                </div>
              </div>
            )}
            <div className={event.coverImage ? "col-lg-7" : "col-lg-12"}>
              <div className="event-info-box wow fadeInUp">
                <ul>
                  <li>
                    <span>date</span>
                    {formatEventDates(event.startDate, event.endDate)}
                  </li>
                  {event.location && (
                    <li>
                      <span>location</span>
                      {event.location}
                    </li>
                  )}
                  <li>
                    <span>status</span>
                    {upcoming ? "Upcoming" : "Past event"}
                  </li>
                </ul>
                {event.registrationUrl && upcoming && (
                  <a href={event.registrationUrl} className="btn-default" target="_blank" rel="noopener noreferrer">
                    register now
                  </a>
                )}
              </div>

              <div className="post-content">
                {/* Content is sanitised when it is saved in the dashboard */}
                <div className="post-entry" dangerouslySetInnerHTML={{ __html: event.content }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
