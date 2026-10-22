import Link from "next/link";
import AdminHeader, { SearchBox, StatusBadge } from "@/components/admin/AdminHeader";
import { db } from "@/lib/db";
import { formatEventDates } from "@/lib/utils";

export default async function AdminEventsPage({ searchParams }: PageProps<"/admin/events">) {
  const q = String((await searchParams).q ?? "").trim();
  const events = await db.event.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { startDate: "desc" },
    take: 200,
  });

  return (
    <>
      <AdminHeader title="Events" description="Upcoming and past events shown on the Events page and the home page." action={{ href: "/admin/events/new", label: "New event" }} />
      <SearchBox q={q} placeholder="Search events…" />
      <div className="card">
        {events.length === 0 ? (
          <div className="empty">
            <i className="fa-regular fa-calendar"></i>
            {q ? "No events match your search." : "No events yet."}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Event date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ width: 72 }}>
                      {event.coverImage ? <img src={event.coverImage} alt="" className="table-thumb" /> : <div className="table-thumb" />}
                    </td>
                    <td>
                      <Link href={`/admin/events/${event.id}`} className="fw-semibold text-decoration-none">
                        {event.title}
                      </Link>
                    </td>
                    <td><StatusBadge on={event.published} /></td>
                    <td className="text-nowrap">{formatEventDates(event.startDate, event.endDate)}</td>
                    <td className="text-end text-nowrap">
                      {event.published && (
                        <a href={`/events/${event.slug}`} target="_blank" className="btn btn-light btn-sm me-1" title="View on website">
                          <i className="fa-solid fa-eye"></i>
                        </a>
                      )}
                      <Link href={`/admin/events/${event.id}`} className="btn btn-outline-primary btn-sm">
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
