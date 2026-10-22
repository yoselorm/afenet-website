import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ContentEditor from "@/components/admin/ContentEditor";
import { FlashToast } from "@/components/admin/Toaster";
import { ConfirmForm } from "@/components/admin/FormBits";
import { getContent } from "@/lib/content";
import { contentSchemas, isContentKey } from "@/lib/content-defaults";
import { resetContent } from "../../../_actions/content";

const PUBLIC_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  events: "/events",
  news: "/news",
  team: "/team",
  contact: "/contact",
  privacy: "/privacy-policy",
  terms: "/terms-of-use",
  settings: "/",
};

export default async function EditPageContent({ params, searchParams }: PageProps<"/admin/pages/[key]">) {
  const { key } = await params;
  const { reset } = await searchParams;
  if (!isContentKey(key)) notFound();

  const schema = contentSchemas[key];
  const content = await getContent(key);

  return (
    <>
      <AdminHeader
        title={schema.title}
        description={schema.description}
        back={key === "settings" ? undefined : { href: "/admin/pages", label: "All pages" }}
      />
      <div className="mb-3 d-flex gap-2">
        <a href={PUBLIC_PATHS[key]} target="_blank" className="btn btn-light btn-sm">
          <i className="fa-solid fa-eye me-1"></i> View on website
        </a>
        <ConfirmForm
          action={resetContent}
          id={0}
          extra={{ key }}
          className="btn btn-outline-secondary btn-sm"
          message="Reset this page to the original default text? Your changes on this page will be lost."
        >
          <i className="fa-solid fa-rotate-left me-1"></i> Reset to defaults
        </ConfirmForm>
      </div>
      {reset && <FlashToast message="Page reset to the default text." />}
      {/* A new key after a reset reloads the form with the default values */}
      <ContentEditor key={String(reset ?? "")} contentKey={key} fields={schema.fields} initial={content} />
    </>
  );
}
