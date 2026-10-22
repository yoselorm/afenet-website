import AdminHeader from "@/components/admin/AdminHeader";
import { NewsForm } from "@/components/admin/EntityForms";

export default function NewNewsPage() {
  return (
    <>
      <AdminHeader title="New news post" back={{ href: "/admin/news", label: "All news" }} />
      <NewsForm />
    </>
  );
}
