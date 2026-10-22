import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/site/PageHeader";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import { paragraphs } from "@/lib/utils";

async function getMember(id: string) {
  const memberId = Number(id);
  if (!Number.isInteger(memberId)) return null;
  return db.teamMember.findFirst({ where: { id: memberId, published: true } });
}

export async function generateMetadata({ params }: PageProps<"/team/[id]">): Promise<Metadata> {
  const member = await getMember((await params).id);
  return member ? { title: member.name } : {};
}

export default async function TeamMemberPage({ params }: PageProps<"/team/[id]">) {
  const [member, teamPage] = await Promise.all([getMember((await params).id), getContent("team")]);
  if (!member) notFound();

  const socials = [
    { url: member.linkedin, icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
    { url: member.twitter, icon: "fa-brands fa-x-twitter", label: "X" },
    { url: member.facebook, icon: "fa-brands fa-facebook-f", label: "Facebook" },
    { url: member.email ? `mailto:${member.email}` : null, icon: "fa-regular fa-envelope", label: "Email" },
  ].filter((s) => s.url);

  return (
    <>
      {/* Uses the Our Team page banner (Page content → Our Team page) */}
      <PageHeader title={member.name} image={teamPage.header.image} crumbs={[{ label: "our team", href: "/team" }]} />

      <div className="page-single-post">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-5">
              <div className="team-single-image">
                <figure className="reveal">
                  <img src={member.photo || "/theme/images/team-1.jpg"} alt={member.name} />
                </figure>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="team-single-content post-entry">
                <h2>{member.name}</h2>
                <p className="team-position">{member.position}</p>
                {member.bio ? (
                  paragraphs(member.bio).map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>{member.category}</p>
                )}
                {socials.length > 0 && (
                  <div className="team-social-icon">
                    <ul>
                      {socials.map((s) => (
                        <li key={s.label}>
                          <a href={s.url!} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                            <i className={s.icon}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
