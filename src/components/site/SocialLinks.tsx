import type { Content } from "@/lib/content-defaults";

const ICONS: Record<keyof Content<"settings">["socials"], string> = {
  facebook: "fa-brands fa-facebook-f",
  twitter: "fa-brands fa-x-twitter",
  linkedin: "fa-brands fa-linkedin-in",
  youtube: "fa-brands fa-youtube",
  instagram: "fa-brands fa-instagram",
};

export default function SocialLinks({ socials }: { socials: Content<"settings">["socials"] }) {
  const entries = (Object.keys(ICONS) as (keyof typeof ICONS)[]).filter((key) => socials[key]);
  if (entries.length === 0) return null;

  return (
    <ul>
      {entries.map((key) => (
        <li key={key}>
          <a href={socials[key]} target="_blank" rel="noopener noreferrer" aria-label={key}>
            <i className={ICONS[key]}></i>
          </a>
        </li>
      ))}
    </ul>
  );
}
