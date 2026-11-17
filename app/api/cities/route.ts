import type { NextRequest } from "next/server";
import { searchCities, UpstreamError } from "@/lib/air";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 60);

  if (query.length < 2) {
    return Response.json({ results: [] });
  }

  try {
    const results = await searchCities(query);
    return Response.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    const status = error instanceof UpstreamError ? error.status : 502;
    return Response.json(
      { error: { code: "upstream", message: "City search is unavailable right now." } },
      { status },
    );
  }
}
