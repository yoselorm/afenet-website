import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import PageHeader from "@/components/site/PageHeader";
import SocialLinks from "@/components/site/SocialLinks";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const [content, settings] = await Promise.all([getContent("contact"), getContent("settings")]);

  const info = [
    { icon: "icon-phone.svg", title: "call us", value: settings.phone },
    { icon: "icon-mail.svg", title: "write to us", value: settings.email },
    { icon: "icon-location.svg", title: "visit us", value: settings.address },
  ];

  return (
    <>
      <PageHeader title={content.header.title} image={content.header.image} />

      <div className="contact-information">
        <div className="container">
          <div className="row">
            {info.map((item, i) => (
              <div key={item.title} className="col-md-4">
                <div className="contact-info-item wow fadeInUp" data-wow-delay={`${(i + 1) * 0.25}s`}>
                  <div className="icon-box">
                    <img src={`/theme/images/${item.icon}`} alt="" />
                  </div>
                  <div className="contact-info-body">
                    <h3>{item.title}</h3>
                    <p>{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="contact-us page-contact-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7">
              <div className="contact-form wow fadeInUp" data-wow-delay="0.5s">
                <div className="section-title">
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    {content.form.title}
                  </h2>
                  <p>{content.form.text}</p>
                </div>
                <ContactForm />
              </div>
            </div>
            <div className="col-lg-4 col-md-5">
              <div className="contact-sidebar page-contact-sidebar wow fadeInUp" data-wow-delay="0.5s">
                {Object.values(settings.socials).some(Boolean) && (
                  <div className="contact-social-list">
                    <h3>follow us</h3>
                    <SocialLinks socials={settings.socials} />
                  </div>
                )}
                {content.form.image && (
                  <div className="contact-info-image">
                    <figure>
                      <img src={content.form.image} alt="" />
                    </figure>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {settings.mapEmbedUrl && (
        <div className="google-map">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="google-map-iframe">
                  <iframe
                    src={settings.mapEmbedUrl}
                    title="Map"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
