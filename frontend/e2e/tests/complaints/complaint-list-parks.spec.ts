import { test, expect } from "@playwright/test";
import { waitForSpinner } from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

/*
Tests to verify complaint list specification functionality
*/

test.describe("Complaint List Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.PARKS });
  test(`Verifies that the HWCR is correct`, async ({ page }) => {
    const complaintType = "#hwcr-tab";
    await page.goto("/");
    await waitForSpinner(page);
    await page.locator(complaintType).click();
    await waitForSpinner(page);

    const allTableHeadTexts = await page.locator("th").allTextContents();

    await expect(await page.locator("#hwcr-tab")).toHaveText(/Human Wildlife Conflicts/);
    await expect(allTableHeadTexts).toContain("Complaint #");
    await expect(allTableHeadTexts).toContain("Date logged");
    await expect(allTableHeadTexts).toContain("Nature of complaint");
    await expect(allTableHeadTexts).toContain("Species");
    await expect(allTableHeadTexts).toContain("Community");
    await expect(allTableHeadTexts).not.toContain("Location/address");
    await expect(allTableHeadTexts).toContain("Park");
    await expect(allTableHeadTexts).toContain("Status");
    await expect(allTableHeadTexts).toContain("Officer assigned");
    await expect(allTableHeadTexts).toContain("Last updated");
    await expect(allTableHeadTexts).toContain("Actions");
    await waitForSpinner(page);
    await expect(await page.locator("#complaint-list")).toBeVisible();
    await expect(await page.locator("#complaint-list tbody tr").count()).toBeGreaterThan(0);
  });

  test(`Verifies that the ERS is correct`, async ({ page }) => {
    const complaintType = "#ers-tab";
    await page.goto("/");
    await waitForSpinner(page);
    await page.locator(complaintType).click();
    await waitForSpinner(page);

    const allTableHeadTexts = await page.locator("th").allTextContents();

    await expect(await page.locator("#ers-tab")).toHaveText(/Enforcement/);
    await expect(allTableHeadTexts).toContain("Complaint #");
    await expect(allTableHeadTexts).toContain("Date logged");
    await expect(allTableHeadTexts).not.toContain("Authorization");
    await expect(allTableHeadTexts).toContain("Violation type");
    await expect(allTableHeadTexts).toContain("Community");
    await expect(allTableHeadTexts).not.toContain("Location/address");
    await expect(allTableHeadTexts).toContain("Park");
    await expect(allTableHeadTexts).toContain("Status");
    await expect(allTableHeadTexts).toContain("Officer assigned");
    await expect(allTableHeadTexts).toContain("Last updated");
    await expect(allTableHeadTexts).toContain("Actions");
    await waitForSpinner(page);
    await expect(await page.locator("#complaint-list")).toBeVisible();
    await expect(await page.locator("#complaint-list tbody tr").count()).toBeGreaterThan(0);
  });

  test(`Verifies that the GIR is correct`, async ({ page }) => {
    const complaintType = "#gir-tab";
    await page.goto("/");
    await waitForSpinner(page);
    await page.locator(complaintType).click();
    await waitForSpinner(page);

    const allTableHeadTexts = await page.locator("th").allTextContents();

    await expect(await page.locator("#gir-tab")).toHaveText(/General Incident/);
    await expect(allTableHeadTexts).toContain("Complaint #");
    await expect(allTableHeadTexts).toContain("Date logged");
    await expect(allTableHeadTexts).toContain("GIR type");
    await expect(allTableHeadTexts).toContain("Community");
    await expect(allTableHeadTexts).not.toContain("Location/address");
    await expect(allTableHeadTexts).toContain("Park");
    await expect(allTableHeadTexts).toContain("Status");
    await expect(allTableHeadTexts).toContain("Officer assigned");
    await expect(allTableHeadTexts).toContain("Last updated");
    await expect(allTableHeadTexts).toContain("Actions");
    await waitForSpinner(page);
    await expect(await page.locator("#complaint-list")).toBeVisible();
    await expect(await page.locator("#complaint-list tbody tr").count()).toBeGreaterThan(0);
  });
});
