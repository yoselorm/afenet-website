import ThemeScripts from "@/components/site/ThemeScripts";

// A template re-mounts on every navigation, so the theme animations re-initialise per page
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ThemeScripts />
    </>
  );
}
