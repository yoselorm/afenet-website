"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Our Team" },
];

export default function Header({ logo, siteName }: { logo: string; siteName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu whenever the page changes
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const links = (
    <>
      {NAV.map((item) => (
        <li key={item.href} className="nav-item">
          <Link className={`nav-link${isActive(item.href) ? " active" : ""}`} href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand" href="/">
              <img src={logo} alt={siteName} />
            </Link>

            <div className="collapse navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  {links}
                </ul>
              </div>
              <div className="header-btn d-inline-flex">
                <Link href="/contact" className="btn-default">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="navbar-toggle">
              <a
                href="#"
                role="button"
                aria-label="Toggle menu"
                aria-expanded={open}
                className={`slicknav_btn ${open ? "slicknav_open" : "slicknav_collapsed"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(!open);
                }}
              >
                <span className="slicknav_icon">
                  <span className="slicknav_icon-bar"></span>
                  <span className="slicknav_icon-bar"></span>
                  <span className="slicknav_icon-bar"></span>
                </span>
              </a>
            </div>
          </div>
        </nav>
        <div className="responsive-menu">
          {open && (
            <div className="slicknav_menu">
              <ul className="slicknav_nav">
                {links}
                <li className="nav-item">
                  <Link className="nav-link" href="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
