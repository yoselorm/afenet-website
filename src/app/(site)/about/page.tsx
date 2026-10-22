import type { Metadata } from "next";
import Link from "next/link";
import { TeamCard } from "@/components/site/Cards";
import PageHeader from "@/components/site/PageHeader";
import SectionTitle from "@/components/site/SectionTitle";
import { CtaBox, FocusAreas } from "@/components/site/Sections";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import { paragraphs } from "@/lib/utils";

export const metadata: Metadata = { title: "About Us" };

const MISSION_ICONS = [
  "/theme/images/icon-our-mission.svg",
  "/theme/images/icon-our-vision.svg",
  "/theme/images/icon-our-values.svg",
];

export default async function AboutPage() {
  const [about, team] = await Promise.all([
    getContent("about"),
    db.teamMember.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take: 3,
    }),
  ]);
  const { whoWeAre, whatWeDo } = about;

  return (
    <>
      <PageHeader title={about.header.title} image={about.header.image} />

      {/* Who we are */}
      <div className="page-about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="about-us-image">
                <div className="about-us-img">
                  <figure className="reveal">
                    <img src={whoWeAre.image} alt="" />
                  </figure>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="about-us-content">
                <SectionTitle subtitle={whoWeAre.subtitle} title={whoWeAre.title} />
                <div className="about-us-body">
                  {paragraphs(whoWeAre.body).map((p, i) => (
                    <p key={i} className="wow fadeInUp" data-wow-delay={`${0.25 * (i + 1)}s`}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, vision, values */}
      {about.missionVision.length > 0 && (
        <div className="our-mission-vision">
          <div className="container">
            <div className="row">
              {about.missionVision.map((item, i) => (
                <div key={i} className="col-lg-4">
                  <div className="mission-vision-item wow fadeInUp" data-wow-delay={`${i * 0.25}s`}>
                    <div className="icon-box">
                      <img src={MISSION_ICONS[i % MISSION_ICONS.length]} alt="" />
                    </div>
                    <div className="mission-vision-content">
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* What we do */}
      <div className="what-we-do-list" id="what-we-do">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <SectionTitle subtitle={whatWeDo.subtitle} title={whatWeDo.title} text={whatWeDo.text} />
            </div>
          </div>
          <FocusAreas items={whatWeDo.items} />
        </div>
      </div>

      <CtaBox cta={about.cta} />

      {/* Team preview */}
      {team.length > 0 && (
        <div className="our-team">
          <div className="container">
            <div className="row section-row">
              <SectionTitle subtitle={about.team.subtitle} title={about.team.title} text={about.team.text} />
            </div>
            <div className="row">
              {team.map((member, i) => (
                <div key={member.id} className="col-lg-4 col-md-6">
                  <TeamCard member={member} index={i} />
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <Link href="/team" className="btn-default">
                meet the full team
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
