import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="empty">
      <i className="fa-regular fa-circle-question"></i>
      <p>That item doesn&apos;t exist. It may have been deleted.</p>
      <Link href="/admin" className="btn btn-primary btn-sm">
        Back to dashboard
      </Link>
    </div>
  );
}
