import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { EventForm } from "@/components/admin/EntityForms";
import { ConfirmForm } from "@/components/admin/FormBits";
import { db } from "@/lib/db";
import { deleteEvent } from "../../../_actions/events";

export default async function EditEventPage({ params, searchParams }: PageProps<"/admin/events/[id]">) {
  const event = await db.event.findUnique({ where: { id: Number((await params).id) || 0 } });
  if (!event) notFound();
  const created = (await searchParams).created;

  return (
    <>
      <AdminHeader title="Edit event" back={{ href: "/admin/events", label: "All events" }} />
      {created && <div className="alert alert-success">Event created.</div>}
      <EventForm event={event} />
      <div className="d-flex gap-2">
        {event.published && (
          <a href={`/events/${event.slug}`} target="_blank" className="btn btn-light btn-sm">
            <i className="fa-solid fa-eye me-1"></i> View on website
          </a>
        )}
        <ConfirmForm action={deleteEvent} id={event.id} message="Delete this event? This cannot be undone.">
          <i className="fa-solid fa-trash me-1"></i> Delete event
        </ConfirmForm>
      </div>
    </>
  );
}
