import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Live modelled air quality for your city, with US and CPCB indices, six pollutant concentrations, weather context and a seven day PM2.5 trend.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
