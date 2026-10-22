export default function SectionTitle({
  subtitle,
  title,
  text,
  as: Heading = "h2",
}: {
  subtitle?: string;
  title: string;
  text?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="section-title">
      {subtitle && <h3 className="wow fadeInUp">{subtitle}</h3>}
      <Heading className="text-anime-style-3" data-cursor="-opaque">
        {title}
      </Heading>
      {text && (
        <p className="wow fadeInUp" data-wow-delay="0.25s">
          {text}
        </p>
      )}
    </div>
  );
}
