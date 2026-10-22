import Link from "next/link";
import type { Event, NewsPost, TeamMember } from "@/generated/prisma/client";
import { formatDate, formatEventDates } from "@/lib/utils";

const PLACEHOLDER = "/theme/images/post-1.jpg";

const delay = (index: number) => `${((index % 3) + 1) * 0.25}s`;

export function NewsCard({ post, index = 0 }: { post: NewsPost; index?: number }) {
  const href = `/news/${post.slug}`;
  return (
    <div className="blog-item wow fadeInUp" data-wow-delay={delay(index)}>
      <div className="post-featured-image" data-cursor-text="View">
        <figure>
          <Link href={href} className="image-anime">
            <img src={post.coverImage || PLACEHOLDER} alt={post.title} />
          </Link>
        </figure>
      </div>
      <div className="post-item-content">
        <div className="post-item-meta">
          <i className="fa-regular fa-clock"></i> {formatDate(post.publishedAt)}
        </div>
        <div className="post-item-body">
          <h2>
            <Link href={href}>{post.title}</Link>
          </h2>
        </div>
        <div className="post-item-footer">
          <Link href={href} className="readmore-btn">
            read more
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const href = `/events/${event.slug}`;
  const start = new Date(event.startDate);
  return (
    <div className="project-item wow fadeInUp" data-wow-delay={delay(index)}>
      <div className="project-image" data-cursor-text="View">
        <Link href={href}>
          <figure>
            <img src={event.coverImage || PLACEHOLDER} alt={event.title} />
          </figure>
        </Link>
        <div className="event-date-badge">
          <span>{start.getDate()}</span>
          {start.toLocaleDateString("en-GB", { month: "short" })}
        </div>
      </div>
      <div className="project-body">
        <div className="project-body-title">
          <h3>{event.title}</h3>
        </div>
        <div className="project-content">
          <ul className="event-meta">
            <li>
              <i className="fa-regular fa-calendar"></i> {formatEventDates(start, event.endDate)}
            </li>
            {event.location && (
              <li>
                <i className="fa-solid fa-location-dot"></i> {event.location}
              </li>
            )}
          </ul>
          {event.summary && <p>{event.summary}</p>}
          <div className="project-content-footer">
            <Link href={href} className="readmore-btn">
              view details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const socials = [
    { url: member.linkedin, icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
    { url: member.twitter, icon: "fa-brands fa-x-twitter", label: "X" },
    { url: member.facebook, icon: "fa-brands fa-facebook-f", label: "Facebook" },
    { url: member.email ? `mailto:${member.email}` : null, icon: "fa-regular fa-envelope", label: "Email" },
  ].filter((s) => s.url);

  return (
    <div className="team-member-item wow fadeInUp" data-wow-delay={delay(index)}>
      <div className="team-image">
        <Link href={`/team/${member.id}`}>
          <figure className="image-anime">
            <img src={member.photo || "/theme/images/team-1.jpg"} alt={member.name} />
          </figure>
        </Link>
      </div>
      <div className="team-body">
        <div className="team-content">
          <h3>
            <Link href={`/team/${member.id}`}>{member.name}</Link>
          </h3>
          <p>{member.position}</p>
        </div>
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
  );
}
