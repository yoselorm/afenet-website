import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { contentKeys, contentSchemas } from "@/lib/content-defaults";

const ICONS: Record<string, string> = {
  home: "fa-solid fa-house",
  about: "fa-regular fa-building",
  events: "fa-regular fa-calendar",
  news: "fa-regular fa-newspaper",
  team: "fa-solid fa-users",
  contact: "fa-regular fa-envelope",
};

export default function PagesIndex() {
  const keys = contentKeys.filter((k) => k !== "settings");
  return (
    <>
      <AdminHeader title="Page content" description="Edit the headings, text and images on each page of the website." />
      <div className="row g-3">
        {keys.map((key) => (
          <div key={key} className="col-md-6 col-xl-4">
            <Link href={`/admin/pages/${key}`} className="card page-card">
              <div className="stat-icon mb-3">
                <i className={ICONS[key]}></i>
              </div>
              <h3>{contentSchemas[key].title}</h3>
              <p>{contentSchemas[key].description}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
