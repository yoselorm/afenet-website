"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  {
    title: null,
    links: [{ href: "/admin", label: "Dashboard", icon: "fa-solid fa-gauge" }],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/news", label: "News", icon: "fa-regular fa-newspaper" },
      { href: "/admin/events", label: "Events", icon: "fa-regular fa-calendar" },
      { href: "/admin/team", label: "Team", icon: "fa-solid fa-users" },
      { href: "/admin/pages", label: "Page content", icon: "fa-regular fa-file-lines" },
    ],
  },
  {
    title: "Inbox",
    links: [{ href: "/admin/messages", label: "Messages", icon: "fa-regular fa-envelope", badge: true }],
  },
  {
    title: "Settings",
    links: [
      { href: "/admin/pages/settings", label: "Site settings", icon: "fa-solid fa-sliders" },
      { href: "/admin/users", label: "Admin users", icon: "fa-solid fa-user-shield" },
      { href: "/admin/account", label: "My account", icon: "fa-regular fa-circle-user" },
    ],
  },
];

export default function Sidebar({ unread }: { unread: number }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/pages") return pathname.startsWith("/admin/pages") && pathname !== "/admin/pages/settings";
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        <img src="/logo-white.png" alt="AFENET" />
      </Link>
      <nav>
        {SECTIONS.map((section, i) => (
          <div key={i} className="admin-nav-section">
            {section.title && <div className="admin-nav-title">{section.title}</div>}
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-nav-link${isActive(link.href) ? " active" : ""}`}
                onClick={() => {
                  const toggle = document.getElementById("nav-toggle") as HTMLInputElement | null;
                  if (toggle) toggle.checked = false;
                }}
              >
                <i className={link.icon}></i>
                <span>{link.label}</span>
                {"badge" in link && unread > 0 && <span className="badge rounded-pill ms-auto">{unread}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
