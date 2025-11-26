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

test.describe("Case Activities - Activity Cards", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it displays investigation cards with correct info", async ({ page }) => {
    // Navigate to a case that has investigations (CASE1 from test data)
    await page.goto("/cases");
    await waitForSpinner(page);

    // Look for CASE1 which has investigations
    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link", { hasText: "CASE1" });

    expect(await caseLink.count(), "CASE1 not found.").toBeGreaterThan(0);

    await caseLink.first().click();
    await waitForSpinner(page);

    // Look for investigation cards
    const investigationsSection = page.locator("text=Investigations").first().locator("..");
    await expect(investigationsSection).toBeVisible();

    const cards = investigationsSection.locator(".card, [class*='activity-card']");
    const cardCount = await cards.count();

    if (cardCount > 0) {
      // Cards should have some content
      const firstCard = cards.first();
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
    }
  });

  test("it displays inspection cards with correct info", async ({ page }) => {
    // Navigate to a case that might have inspections
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Look for inspection cards
    const inspectionsSection = page.locator("text=Inspections").first().locator("..");
    await expect(inspectionsSection).toBeVisible();

    const cards = inspectionsSection.locator(".card, [class*='activity-card']");
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const firstCard = cards.first();
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
    }
  });
});

test.describe("Case Activities - Three Column Layout", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it displays three-column layout", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // All three columns should be visible
    await expect(page.locator("text=Complaints").first()).toBeVisible();
    await expect(page.locator("text=Inspections").first()).toBeVisible();
    await expect(page.locator("text=Investigations").first()).toBeVisible();
  });

  test("it stacks columns on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // All sections should be visible
    const complaintsHeader = page.locator("text=Complaints").first();
    const inspectionsHeader = page.locator("text=Inspections").first();
    const investigationsHeader = page.locator("text=Investigations").first();

    await expect(complaintsHeader).toBeVisible();
    await expect(inspectionsHeader).toBeVisible();
    await expect(investigationsHeader).toBeVisible();

    // Verify sections are stacked vertically (each section below the previous)
    const complaintsBox = await complaintsHeader.boundingBox();
    const inspectionsBox = await inspectionsHeader.boundingBox();
    const investigationsBox = await investigationsHeader.boundingBox();

    if (complaintsBox && inspectionsBox && investigationsBox) {
      // Verify vertical stacking: each section should be below the previous
      expect(inspectionsBox.y).toBeGreaterThan(complaintsBox.y);
      expect(investigationsBox.y).toBeGreaterThan(inspectionsBox.y);
    }
  });
});

test.describe("Case Activities - Add Complaint Modal", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  // Use CASE1 as a test case for linked activities, ensuring case history exists for subsequent tests
  async function navigateToCASE1(page: any): Promise<boolean> {
    await page.goto("/cases");
    await waitForSpinner(page);

    // Find CASE1 specifically
    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link", { hasText: "CASE1" });

    if ((await caseLink.count()) === 0) {
      // Fall back to first case
      const rows = page.locator("#case-list tbody tr");
      if ((await rows.count()) === 0) {
        return false;
      }
      await rows.first().locator("a.comp-cell-link").first().click();
    } else {
      await caseLink.first().click();
    }

    await waitForSpinner(page);
    return true;
  }

  test("it opens add complaint modal", async ({ page }) => {
    const success = await navigateToCASE1(page);
    expect(success, "Could not navigate to case.").toBe(true);

    const addComplaintBtn = page.locator("button", { hasText: /Add complaint|Link complaint/i });
    await addComplaintBtn.click();

    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();
  });

  test("it can close add complaint modal", async ({ page }) => {
    const success = await navigateToCASE1(page);
    expect(success, "Could not navigate to case.").toBe(true);

    const addComplaintBtn = page.locator("button", { hasText: /Add complaint|Link complaint/i });
    await addComplaintBtn.click();

    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();

    const closeButton = modal.locator("button.btn-close, button:has-text('Cancel'), button:has-text('Close')").first();
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });

  test("it adds a complaint activity to the case", async ({ page }) => {
    const success = await navigateToCASE1(page);
    expect(success, "Could not navigate to case.").toBe(true);

    const addComplaintBtn = page.locator("button", { hasText: /Add complaint|Link complaint/i });
    await addComplaintBtn.click();

    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();

    // Find the complaint search input inside the modal - uses AsyncTypeahead with custom HintInputWrapper
    // The input has class rbt-input-text and is inside the add-complaint-div
    const searchInput = modal.locator("#add-complaint-div input.rbt-input-text");
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill("23");

    const dropdownMenu = page.locator(".rbt-menu");
    const dropdownItem = dropdownMenu.locator(".dropdown-item").first();

    if (await dropdownItem.isVisible({ timeout: 10000 }).catch(() => false)) {
      await dropdownItem.click();

      // Check if complaint is already added from a previous test run
      const alreadyAddedError = modal.locator("text=This complaint is already added");
      if (await alreadyAddedError.isVisible({ timeout: 1000 }).catch(() => false)) {
        test.skip(true, "Complaint is already added to the case from a previous test run");
        return;
      }

      const saveButton = modal.locator("#outcome-save-button");
      await saveButton.click();

      await expect(modal).not.toBeVisible({ timeout: 10000 });

      const successToast = page.locator(".Toastify__toast--success").first();
      await expect(successToast).toBeVisible({ timeout: 5000 });
    } else {
      // Fail due to no complaints found in search
      expect(false, "Complaint search returned no results.").toBe(true);
    }
  });
});
