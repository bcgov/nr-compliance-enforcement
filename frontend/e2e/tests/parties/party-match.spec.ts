import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById } from "../../utils/helpers";

/**
 * Tests for party matching on the investigation party form
 * Verifies matching profiles are suggested once enough identifying information is entered
 */
test.describe("Party Match Suggestions", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  const INVESTIGATION_PATH = "investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f200/";

  test("it suggests a matching profile once two match fields are entered", async ({ page }) => {
    await page.goto(INVESTIGATION_PATH);
    await expect(page.locator("h1.comp-box-complaint-id")).not.toContainText("Unknown", { timeout: 15000 });
    await page.locator("#parties").click();

    await page.locator("#add-party-button").click();
    await page.waitForURL(/\/investigation\/[^/]+\/party\/add$/);

    await selectItemById("party-type-select", "Person", page);

    // Seeded shared party
    await page.locator("#FirstName").fill("Michael");

    const lastNameInput = page.locator("#LastName");
    await lastNameInput.fill("Scott");

    // Blur fires the match without waiting out the debounce
    await lastNameInput.blur();

    await expect(page.locator(".comp-party-match-results")).toBeVisible();
    await expect(page.locator(".comp-party-match-card-name").first()).toContainText("SCOTT, Michael");

    const firstCard = page.locator(".comp-party-match-card").first();
    await firstCard.locator(".comp-party-match-card-score-toggle").click();
    await expect(firstCard.locator(".comp-party-match-card-score-line").first()).toBeVisible();
  });
});
