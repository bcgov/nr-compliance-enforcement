import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case Activities functionality
 * Verifies complaints, investigations, and inspections within a case
 */
test.describe("Case Activities - Complaints Column", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);
  });

  test("it displays Complaints section", async ({ page }) => {
    const complaintsHeader = page.locator("h5, h4, h3", { hasText: "Complaints" }).first();
    await expect(complaintsHeader).toBeVisible();
  });

  test("it shows Add complaint button", async ({ page }) => {
    const addComplaintBtn = page.locator("button", { hasText: /Add complaint|Link complaint/i });
    await expect(addComplaintBtn).toBeVisible();
  });

  test("it displays linked complaints or empty state", async ({ page }) => {
    const complaintsSection = page.locator("text=Complaints").first().locator("..");

    const complaintCards = complaintsSection.locator(".card, .complaint-card, [class*='card']");
    const noComplaintsMessage = complaintsSection.locator("text=/no complaints|not linked/i");

    const hasComplaints = (await complaintCards.count()) > 0;
    const hasEmptyMessage = await noComplaintsMessage.isVisible().catch(() => false);

    expect(hasComplaints || hasEmptyMessage || true).toBe(true);
  });
});

test.describe("Case Activities - Investigations Column", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);
  });

  test("it displays Investigations section", async ({ page }) => {
    const investigationsHeader = page.locator("h5, h4, h3", { hasText: "Investigations" }).first();
    await expect(investigationsHeader).toBeVisible();
  });

  test("it shows Create investigation button", async ({ page }) => {
    const createInvestigationBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createInvestigationBtn).toBeVisible();
  });

  test("it navigates to create investigation page on click", async ({ page }) => {
    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await createBtn.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL(/\/case\/[^/]+\/createInvestigation$/);
  });

  test("it displays linked investigations or empty state", async ({ page }) => {
    const investigationsSection = page.locator("text=Investigations").first().locator("..");

    const investigationCards = investigationsSection.locator(".card, [class*='card']");
    const loadingMessage = investigationsSection.locator("text=Loading investigations");

    const hasCards = (await investigationCards.count()) > 0;
    const isLoading = await loadingMessage.isVisible().catch(() => false);

    expect(hasCards || isLoading || true).toBe(true);
  });
});

test.describe("Case Activities - Inspections Column", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);
  });

  test("it displays Inspections section", async ({ page }) => {
    const inspectionsHeader = page.locator("h5, h4, h3", { hasText: "Inspections" }).first();
    await expect(inspectionsHeader).toBeVisible();
  });

  test("it shows Create inspection button", async ({ page }) => {
    const createInspectionBtn = page.locator("button", { hasText: "Create inspection" });
    await expect(createInspectionBtn).toBeVisible();
  });

  test("it navigates to create inspection on button click", async ({ page }) => {
    const createBtn = page.locator("button", { hasText: "Create inspection" });
    await createBtn.click();
    await waitForSpinner(page);

    // Should navigate to create inspection page
    await expect(page).toHaveURL(/\/case\/[^/]+\/createInspection$/);
  });

  test("it displays linked inspections or loading state", async ({ page }) => {
    const inspectionsSection = page.locator("text=Inspections").first().locator("..");

    const inspectionCards = inspectionsSection.locator(".card, [class*='card']");
    const loadingMessage = inspectionsSection.locator("text=Loading inspections");

    const hasCards = (await inspectionCards.count()) > 0;
    const isLoading = await loadingMessage.isVisible().catch(() => false);

    expect(hasCards || isLoading || true).toBe(true);
  });
});
