import Link from "next/link";
import type { Content } from "@/lib/content-defaults";
import SocialLinks from "./SocialLinks";

export default function Footer({ settings }: { settings: Content<"settings"> }) {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-12">
            <div className="about-footer">
              <div className="footer-logo">
                <figure>
                  <img src={settings.footerLogo} alt={settings.siteName} />
                </figure>
              </div>
              <div className="footer-content">
                <p>{settings.footerText}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-5 col-12">
            <div className="footer-links">
              <h3>quick links</h3>
              <ul>
                <li><Link href="/about">about us</Link></li>
                <li><Link href="/events">events</Link></li>
                <li><Link href="/news">news</Link></li>
                <li><Link href="/team">our team</Link></li>
                <li><Link href="/contact">contact us</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-7 col-12">
            <div className="footer-links footer-contact-box">
              <h3>contact us</h3>
              <div className="footer-info-box">
                <div className="icon-box">
                  <img src="/theme/images/icon-phone.svg" alt="" />
                </div>
                <p>{settings.phone}</p>
              </div>
              <div className="footer-info-box">
                <div className="icon-box">
                  <img src="/theme/images/icon-mail.svg" alt="" />
                </div>
                <p>{settings.email}</p>
              </div>
              <div className="footer-info-box">
                <div className="icon-box">
                  <img src="/theme/images/icon-location.svg" alt="" />
                </div>
                <p>{settings.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-7">
              <div className="footer-copyright-text">
                <p>
                  Copyright © {new Date().getFullYear()} {settings.copyright}
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-5">
              <div className="footer-social-links">
                <SocialLinks socials={settings.socials} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
