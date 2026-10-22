import Link from "next/link";

export default function PageHeader({
  title,
  image,
  crumbs = [],
  children,
}: {
  title: string;
  image?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div
      className="page-header parallaxie"
      style={image ? { backgroundImage: `url("${image}")` } : undefined}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-header-box">
              <h1 className="text-anime-style-3" data-cursor="-opaque">
                {title}
              </h1>
              {children ?? (
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">home</Link>
                    </li>
                    {crumbs.map((crumb) => (
                      <li key={crumb.label} className="breadcrumb-item">
                        {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                      </li>
                    ))}
                    <li className="breadcrumb-item active" aria-current="page">
                      {title}
                    </li>
                  </ol>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
