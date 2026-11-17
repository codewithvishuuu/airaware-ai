import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/lib/location";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AirAware AI — Understand Your Air. Protect Your Everyday.",
    template: "%s · AirAware AI",
  },
  description:
    "An air quality assistant for families in smog-prone cities: live modelled readings, CPCB and US AQI side by side, a daily action plan, indoor guidance and trip-emissions comparison, grounded in real data.",
  applicationName: "AirAware AI",
  keywords: ["air quality", "AQI", "CPCB", "PM2.5", "smog", "Delhi", "indoor air"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocationProvider>
          <a href="#main" className="sr-only-focusable z-50 rounded bg-ink px-3 py-2 text-sm text-white">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <footer className="mt-16 border-t border-line">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
              <p className="text-sm font-medium text-ink">AirAware AI</p>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
                Readings are modelled forecasts from the Copernicus Atmosphere Monitoring Service,
                served through Open-Meteo. They are not measurements from a regulatory monitoring
                station and can differ from the air at your street. CPCB values shown here are
                calculated by this app from those modelled concentrations using CPCB breakpoints;
                they are not official CPCB readings. Nothing here is medical advice.
              </p>
              <p className="mt-3 text-xs text-ink-muted">
                Data: Open-Meteo (CAMS air quality, weather, geocoding) · AI: Google Gemini
              </p>
            </div>
          </footer>
        </LocationProvider>
      </body>
    </html>
  );
}
