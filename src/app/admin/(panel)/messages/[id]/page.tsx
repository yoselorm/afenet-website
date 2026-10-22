import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { ConfirmForm } from "@/components/admin/FormBits";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteMessage, setMessageRead } from "../../../_actions/messages";

export default async function MessagePage({ params }: PageProps<"/admin/messages/[id]">) {
  const id = Number((await params).id) || 0;
  let message = await db.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  // Opening a message marks it as read
  if (!message.isRead) {
    message = await db.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  const time = message.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <AdminHeader title={message.subject || "Message"} back={{ href: "/admin/messages", label: "All messages" }} />
      <div className="card mb-3">
        <div className="card-body p-4">
          <dl className="row mb-4">
            <dt className="col-sm-2">From</dt>
            <dd className="col-sm-10">{message.name}</dd>
            <dt className="col-sm-2">Email</dt>
            <dd className="col-sm-10">
              <a href={`mailto:${message.email}`}>{message.email}</a>
            </dd>
            {message.phone && (
              <>
                <dt className="col-sm-2">Phone</dt>
                <dd className="col-sm-10">
                  <a href={`tel:${message.phone}`}>{message.phone}</a>
                </dd>
              </>
            )}
            <dt className="col-sm-2">Received</dt>
            <dd className="col-sm-10">
              {formatDate(message.createdAt)} at {time}
            </dd>
          </dl>
          <div className="message-body">{message.message}</div>
        </div>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Your message to AFENET"}`)}`}
          className="btn btn-primary btn-sm"
        >
          <i className="fa-solid fa-reply me-1"></i> Reply by email
        </a>
        <form action={setMessageRead}>
          <input type="hidden" name="id" value={message.id} />
          <input type="hidden" name="isRead" value="false" />
          <button className="btn btn-light btn-sm">Mark as unread</button>
        </form>
        <ConfirmForm action={deleteMessage} id={message.id} message="Delete this message?">
          <i className="fa-solid fa-trash me-1"></i> Delete
        </ConfirmForm>
      </div>
    </>
  );
}
