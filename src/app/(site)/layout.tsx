import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { getContent } from "@/lib/content";

// Every page reads live content from the database
export const dynamic = "force-dynamic";

const THEME_CSS = [
  "bootstrap.min.css",
  "slicknav.min.css",
  "swiper-bundle.min.css",
  "all.css",
  "animate.css",
  "magnific-popup.css",
  "mousecursor.css",
  "custom.css",
  "afenet.css",
];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, about] = await Promise.all([getContent("settings"), getContent("about")]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Manrope:wght@200..800&display=swap"
        precedence="theme"
      />
      {THEME_CSS.map((file) => (
        <link key={file} rel="stylesheet" href={`/theme/css/${file}`} precedence="theme" />
      ))}

      <noscript>
        <style>{".preloader{display:none}"}</style>
      </noscript>
      <div className="preloader">
        <div className="loading-container">
          <div className="loading"></div>
          <div id="loading-icon">
            <img src="/loader-africa.png" alt="" />
          </div>
        </div>
      </div>

      <Header logo={settings.logo} siteName={settings.siteName} />
      {children}
      <Footer settings={settings} focusAreas={about.whatWeDo.items} />
    </>
  );
}
