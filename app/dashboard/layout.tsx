import type { Metadata } from "next";
import { SHARE_IMAGE, SITE_DASHBOARD_DESCRIPTION, SITE_DASHBOARD_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Live modelled air quality for your city, with US and CPCB indices, six pollutant concentrations, weather context and a seven day PM2.5 trend.",
  alternates: { canonical: "/dashboard" },
  openGraph: {
    type: "website",
    url: "/dashboard",
    title: SITE_DASHBOARD_TITLE,
    description: SITE_DASHBOARD_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DASHBOARD_TITLE,
    description: SITE_DASHBOARD_DESCRIPTION,
    images: [SHARE_IMAGE.url],
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
