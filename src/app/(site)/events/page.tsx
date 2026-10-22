import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/site/Cards";
import PageHeader from "@/components/site/PageHeader";
import { Pagination } from "@/components/site/Sections";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import { startOfToday } from "@/lib/utils";

export const metadata: Metadata = { title: "Events" };

const PER_PAGE = 9;

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const params = await searchParams;
  const past = params.show === "past";
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    published: true,
    startDate: past ? { lt: startOfToday() } : { gte: startOfToday() },
  };

  const [content, events, total] = await Promise.all([
    getContent("events"),
    db.event.findMany({
      where,
      orderBy: { startDate: past ? "desc" : "asc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.event.count({ where }),
  ]);

  return (
    <>
      <PageHeader title={content.header.title} image={content.header.image} />

      <div className="page-project">
        <div className="container">
          <div className="event-filter wow fadeInUp">
            <Link href="/events" className={`btn-default${past ? "" : " active"}`}>
              upcoming events
            </Link>
            <Link href="/events?show=past" className={`btn-default${past ? " active" : ""}`}>
              past events
            </Link>
          </div>

          <div className="row">
            {events.length === 0 && (
              <p className="empty-state">{past ? "No past events yet." : "No upcoming events at the moment. Check back soon."}</p>
            )}
            {events.map((event, i) => (
              <div key={event.id} className="col-lg-4 col-md-6">
                <EventCard event={event} index={i} />
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={Math.ceil(total / PER_PAGE)}
            basePath={past ? "/events?show=past" : "/events"}
          />
        </div>
      </div>
    </>
  );
}
