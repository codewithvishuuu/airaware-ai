import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/lib/location";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AirAware AI | The air around you matters",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "air quality",
    "AQI",
    "CPCB",
    "PM2.5",
    "smog",
    "Delhi",
    "indoor air",
    "environmental intelligence",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "AirAware AI | The air around you matters",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero-city-haze.jpg",
        width: 1800,
        height: 1051,
        alt: "A city skyline dissolving into morning haze above a canopy of trees.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirAware AI | The air around you matters",
    description: SITE_DESCRIPTION,
    images: ["/images/hero-city-haze.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocationProvider>
          <a
            href="#main"
            className="sr-only-focusable z-50 rounded bg-ink px-3 py-2 text-sm text-white"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LocationProvider>
      </body>
    </html>
  );
}
