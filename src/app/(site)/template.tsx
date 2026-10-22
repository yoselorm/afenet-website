"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import ThemeScripts from "@/components/site/ThemeScripts";

// Re-mounts the page on every URL change (including /team → /team/1, where the
// template itself is reused) so the theme animations re-initialise on fresh markup
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Fragment key={pathname}>
      {children}
      <ThemeScripts />
    </Fragment>
  );
}
