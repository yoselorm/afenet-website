import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AFENET | African Field Epidemiology Network",
    template: "%s | AFENET",
  },
  description:
    "The African Field Epidemiology Network (AFENET) is a not-for-profit networking and service alliance organisation improving public health systems across Africa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
