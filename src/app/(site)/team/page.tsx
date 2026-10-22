import type { Metadata } from "next";
import { TeamCard } from "@/components/site/Cards";
import PageHeader from "@/components/site/PageHeader";
import SectionTitle from "@/components/site/SectionTitle";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import type { TeamMember } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Our Team" };

export default async function TeamPage() {
  const [content, members] = await Promise.all([
    getContent("team"),
    db.teamMember.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
  ]);

  // Group members by category, keeping the order in which categories first appear
  const groups = new Map<string, TeamMember[]>();
  for (const member of members) {
    const key = member.category ?? "";
    groups.set(key, [...(groups.get(key) ?? []), member]);
  }

  return (
    <>
      <PageHeader title={content.header.title} image={content.header.image} />

      <div className="page-team">
        <div className="container">
          {content.intro.title && (
            <div className="row section-row">
              <SectionTitle subtitle={content.intro.subtitle} title={content.intro.title} text={content.intro.text} />
            </div>
          )}

          {members.length === 0 && <p className="empty-state">Team members will be listed here soon.</p>}

          {[...groups].map(([category, group]) => (
            <div key={category || "team"}>
              {category && groups.size > 1 && (
                <div className="section-title team-category-title">
                  <h3 className="wow fadeInUp">{category}</h3>
                </div>
              )}
              <div className="row">
                {group.map((member, i) => (
                  <div key={member.id} className="col-lg-3 col-md-4 col-6">
                    <TeamCard member={member} index={i} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
