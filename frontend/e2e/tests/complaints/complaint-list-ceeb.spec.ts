import { test, expect } from "@playwright/test";
import { waitForSpinner } from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
/*
Tests to verify complaint list specification functionality
*/

test.describe("Complaint List Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.CEEB });

  test(`Verifies that the ERS is correct`, async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);
    await page.locator("#ers-tab").click();

    const allTableHeadTexts = await page.locator("th").allTextContents();

    await expect(await page.locator("#ers-tab")).toHaveText(/Waste and Pesticides/);
    await expect(allTableHeadTexts).toContain("Complaint #");
    await expect(allTableHeadTexts).toContain("Date logged");
    await expect(allTableHeadTexts).toContain("Authorization");
    await expect(allTableHeadTexts).toContain("Violation type");
    await expect(allTableHeadTexts).toContain("Community");
    await expect(allTableHeadTexts).toContain("Location/address");
    await expect(allTableHeadTexts).not.toContain("Park");
    await expect(allTableHeadTexts).toContain("Status");
    await expect(allTableHeadTexts).toContain("Officer assigned");
    await expect(allTableHeadTexts).toContain("Last updated");
    await expect(allTableHeadTexts).toContain("Actions");
  });
});
