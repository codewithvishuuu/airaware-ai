import type { NextRequest } from "next/server";
import { getAirData, isValidCoordinate, UpstreamError } from "@/lib/air";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const name = (params.get("name") ?? "Selected location").slice(0, 80);

  if (!isValidCoordinate(lat, lon)) {
    return Response.json(
      { error: { code: "invalid_location", message: "Latitude and longitude are required and must be valid." } },
      { status: 400 },
    );
  }

  try {
    const data = await getAirData(lat, lon, {
      name,
      admin: params.get("admin")?.slice(0, 80) ?? undefined,
      country: params.get("country")?.slice(0, 80) ?? undefined,
      countryCode: params.get("countryCode")?.slice(0, 4) ?? undefined,
      latitude: lat,
      longitude: lon,
    });

    return Response.json(data, {
      headers: {
        // Modelled readings update hourly upstream; ten minutes keeps the dashboard lively
        // without hammering the free tier.
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    if (error instanceof UpstreamError) {
      return Response.json(
        { error: { code: "upstream", message: error.message } },
        { status: error.status },
      );
    }
    return Response.json(
      { error: { code: "unknown", message: "Could not load air quality data." } },
      { status: 500 },
    );
  }
}
