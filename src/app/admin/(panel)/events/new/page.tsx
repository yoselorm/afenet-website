import AdminHeader from "@/components/admin/AdminHeader";
import { EventForm } from "@/components/admin/EntityForms";

export default function NewEventPage() {
  return (
    <>
      <AdminHeader title="New event" back={{ href: "/admin/events", label: "All events" }} />
      <EventForm />
    </>
  );
}
