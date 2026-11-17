import type { NextRequest } from "next/server";
import { z } from "zod";
import { getAirData, isValidCoordinate, UpstreamError } from "@/lib/air";
import {
  AiError,
  aiConfigured,
  activeModel,
  chatReply,
  dailyPlan,
  indoorGuidance,
} from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
// Two model attempts at 30s each is bounded by this. Without it Vercel's default
// function timeout would cut the request before the structured answer arrives.
export const maxDuration = 50;

const placeSchema = z.object({
  name: z.string().min(1).max(80),
  admin: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  countryCode: z.string().max(4).optional(),
});

const bodySchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("chat"),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    place: placeSchema,
    message: z.string().min(2).max(800),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().max(1500),
        }),
      )
      .max(10)
      .default([]),
  }),
  z.object({
    mode: z.literal("plan"),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    place: placeSchema,
    profile: z.object({
      routine: z.string().max(200).default("Standard weekday"),
      outdoorActivity: z.string().max(200).default("Walks and errands"),
      transport: z.string().max(200).default("Mixed"),
      household: z.string().max(200).default("Not specified"),
      concerns: z.string().max(200).default("General health"),
    }),
  }),
  z.object({
    mode: z.literal("indoor"),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    place: placeSchema,
    household: z.string().max(300).default("Typical urban apartment"),
  }),
]);

function fail(status: number, code: string, message: string, retryAfter?: number) {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
    },
  );
}

export async function POST(request: NextRequest) {
  if (!aiConfigured()) {
    return fail(
      503,
      "missing_key",
      "The AI assistant is not configured on this server. Add GEMINI_API_KEY and redeploy.",
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return fail(
      429,
      "rate_limited",
      "That is a lot of questions at once. Wait a minute and try again.",
      limit.retryAfter,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail(400, "invalid_body", "Request body must be JSON.");
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return fail(400, "invalid_body", parsed.error.issues[0]?.message ?? "Invalid request.");
  }

  const input = parsed.data;
  if (!isValidCoordinate(input.lat, input.lon)) {
    return fail(400, "invalid_location", "Coordinates are outside the valid range.");
  }

  try {
    // The model is grounded in a server-side fetch, never in numbers sent by the browser.
    const air = await getAirData(input.lat, input.lon, {
      name: input.place.name,
      admin: input.place.admin,
      country: input.place.country,
      countryCode: input.place.countryCode,
      latitude: input.lat,
      longitude: input.lon,
    });

    if (input.mode === "chat") {
      const text = await chatReply(air, input.message, input.history);
      return Response.json({ mode: "chat", text, model: activeModel(), configured: true });
    }

    if (input.mode === "plan") {
      const data = await dailyPlan(air, input.profile);
      return Response.json({ mode: "plan", data, model: activeModel(), configured: true });
    }

    const data = await indoorGuidance(air, input.household);
    return Response.json({ mode: "indoor", data, model: activeModel(), configured: true });
  } catch (error) {
    if (error instanceof AiError) {
      const status =
        error.code === "missing_key" || error.code === "busy" || error.code === "model_unavailable"
          ? 503
          : error.code === "timeout"
            ? 504
            : 502;
      return fail(status, error.code, error.message);
    }
    if (error instanceof UpstreamError) {
      return fail(502, "upstream", "Air quality data is unavailable, so the assistant cannot ground an answer.");
    }
    return fail(500, "unknown", "The assistant failed unexpectedly.");
  }
}
