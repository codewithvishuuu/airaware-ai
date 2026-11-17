import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { airFixture } from "./fixture";

async function mockAir(page: Page, overrides = {}) {
  await page.route("**/api/air*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(airFixture(overrides)),
    }),
  );
}

async function mockAi(page: Page, status: number, code: string, message: string) {
  await page.route("**/api/ai", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ error: { code, message } }),
    }),
  );
}

test.describe("live data", () => {
  test("dashboard renders real readings from Open-Meteo", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("New Delhi");
    await expect(page.getByTestId("aqi-value")).toBeVisible({ timeout: 30_000 });

    const value = await page.getByTestId("aqi-value").innerText();
    expect(Number(value)).toBeGreaterThan(0);
    expect(Number(value)).toBeLessThanOrEqual(500);

    await expect(page.getByTestId("aqi-band")).toBeVisible();
    await expect(page.getByText(/US EPA AQI from CAMS modelled data/)).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
  });

  test("city search returns geocoded places", async ({ page }) => {
    await mockAir(page);
    await page.route("**/api/cities*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: "19.07,72.87",
              name: "Mumbai",
              admin: "Maharashtra",
              country: "India",
              countryCode: "IN",
              latitude: 19.07,
              longitude: 72.87,
            },
          ],
        }),
      }),
    );

    await page.goto("/dashboard");
    await page.getByRole("button", { name: /New Delhi/ }).click();
    await page.getByLabel("Search for a city").fill("mumbai");
    await expect(page.getByRole("button", { name: /Mumbai/ })).toBeVisible();
  });
});

test.describe("failure states", () => {
  test("invalid location is reported instead of rendered blank", async ({ page }) => {
    await page.route("**/api/air*", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: { code: "invalid_location", message: "Latitude and longitude are required and must be valid." },
        }),
      }),
    );

    await page.goto("/dashboard");
    await expect(page.getByText(/Could not load readings/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("a missing API key is disclosed, never faked as an answer", async ({ page }) => {
    await mockAir(page);
    await mockAi(page, 503, "missing_key", "GEMINI_API_KEY is not configured.");

    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Generate briefing" }).click();

    await expect(page.getByText("Live AI is not configured")).toBeVisible();
    await expect(page.getByText(/no AI answer is generated/i)).toBeVisible();
  });

  test("a Gemini 503 is surfaced with an explanation and a retry", async ({ page }) => {
    await mockAir(page);
    await mockAi(page, 503, "busy", "The AI model is busy right now.");

    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Generate briefing" }).click();

    await expect(page.getByText("Gemini is busy")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("assistant refuses to invent an answer when the model fails", async ({ page }) => {
    await mockAir(page);
    await mockAi(page, 503, "busy", "The AI model is busy right now.");

    await page.goto("/assistant");
    await page.getByRole("button", { name: "Is it safe to run outside at 7pm?" }).click();

    await expect(page.getByText("Gemini is busy")).toBeVisible();
    await expect(page.getByText(/Nothing is wrong with your setup/)).toBeVisible();
  });
});

test.describe("data honesty", () => {
  test("switching to CPCB shows the computed value and its caveat", async ({ page }) => {
    await mockAir(page);
    await page.goto("/dashboard");

    await expect(page.getByTestId("aqi-value")).toHaveText("172");
    await page.getByRole("button", { name: "CPCB AQI" }).click();
    await expect(page.getByTestId("aqi-value")).toHaveText("284");
    await expect(page.getByText(/not an official CPCB station reading/i)).toBeVisible();
  });

  test("stale readings are flagged", async ({ page }) => {
    await mockAir(page, { stale: true });
    await page.goto("/dashboard");
    await expect(page.getByText(/more than three hours old/i)).toBeVisible();
  });
});

test.describe("responsive layout", () => {
  for (const viewport of [
    { name: "phone", width: 390, height: 844 },
    { name: "tablet", width: 834, height: 1112 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test(`no horizontal overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await mockAir(page);
      await page.goto("/dashboard");
      await expect(page.getByTestId("aqi-value")).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll).toBeLessThanOrEqual(overflow.client + 1);
    });
  }

  test("navigation stays reachable on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockAir(page);
    await page.goto("/dashboard");

    const nav = page.getByRole("navigation", { name: "Main" }).last();
    await expect(nav).toBeVisible();

    await nav.getByRole("link", { name: "Assistant" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ask about the air");
  });
});

test.describe("accessibility", () => {
  for (const path of [
    "/",
    "/dashboard",
    "/assistant",
    "/plan",
    "/indoor",
    "/impact",
    "/insights",
  ]) {
    test(`${path} has no serious accessibility violations`, async ({ page }) => {
      await mockAir(page);
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const serious = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      );

      expect(
        serious.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => node.target.join(" ")),
        })),
      ).toEqual([]);
    });
  }
});
