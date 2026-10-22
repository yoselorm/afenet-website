import Link from "next/link";

export default function AdminHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  back?: { href: string; label: string };
}) {
  return (
    <div className="admin-page-header">
      <div>
        {back && (
          <Link href={back.href} className="small text-decoration-none d-inline-block mb-1">
            <i className="fa-solid fa-arrow-left me-1"></i> {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-accent">
          <i className="fa-solid fa-plus me-1"></i> {action.label}
        </Link>
      )}
    </div>
  );
}

export function StatusBadge({ on, onLabel = "Published", offLabel = "Draft" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return <span className={`badge ${on ? "text-bg-success" : "text-bg-secondary"}`}>{on ? onLabel : offLabel}</span>;
}

export function SearchBox({ q, placeholder }: { q?: string; placeholder: string }) {
  return (
    <form className="mb-3" role="search">
      <div className="input-group" style={{ maxWidth: 420 }}>
        <span className="input-group-text bg-white">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input name="q" defaultValue={q} className="form-control" placeholder={placeholder} />
      </div>
    </form>
  );
}
