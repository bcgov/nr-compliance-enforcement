import { test, expect, type Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for updating an investigation party from the shared party it was copied from
 * Verifies the not up-to-date alert appears once the shared party changes, that editing
 * is blocked while it shows, and that pulling the shared changes clears it
 */
test.describe("Investigation Party Update From Shared Party", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" });

  // Not the parties spec's investigation: both files mutate their fixture's parties and run in parallel workers
  const INVESTIGATION_PATH = "investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f201/";

  // Timestamp-derived so it can't collide with the published parties left behind by earlier runs
  const uniqueBusinessNumber = Date.now().toString().slice(-8);
  const businessName = `Cedar Ridge Contracting ${uniqueBusinessNumber}`;
  const updatedBusinessName = `${businessName} Updated`;

  // Captured from the urls the tests land on, then reused by the tests that follow
  let sharedPartyPath = "";
  let investigationPartyPath = "";

  const openPartiesTab = async (page: Page) => {
    await page.goto(INVESTIGATION_PATH);
    await expect(page.locator("h1.comp-box-complaint-id")).not.toContainText("Unknown", { timeout: 15000 });
    await page.locator("#parties").click();
  };

  // Remove the party this spec added so the investigation doesn't accumulate duplicate parties
  const removeInvestigationParty = async (page: Page) => {
    await openPartiesTab(page);
    const partyCard = page.locator(".party-card--linked", { hasText: businessName }).first();
    if ((await partyCard.count()) === 0) {
      return;
    }

    await partyCard.getByRole("button", { name: "Remove" }).click();

    const confirmModal = page.locator(".modal").first();
    await expect(confirmModal).toBeVisible();
    await confirmModal.locator("button", { hasText: "Yes, remove party" }).click();

    await expect(page.locator(".party-card--linked", { hasText: businessName })).toHaveCount(0, { timeout: 10000 });
  };

  // Runs even when a test fails. The published party cannot be removed through the ui, so it is left behind
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const page = await context.newPage();
    await removeInvestigationParty(page);
  });

  test("it publishes a party and copies it into the investigation", async ({ page }) => {
    await page.goto("/party/create");
    await waitForSpinner(page);

    // Select party type - Organization
    await selectItemById("party-type-select", "Organization", page);

    const businessNameInput = page.locator("#businessName");
    await businessNameInput.fill(businessName);

    const businessNumberInput = page.locator("#businessNumber");
    await businessNumberInput.fill(uniqueBusinessNumber);

    // Save
    const saveButton = page.locator("#details-screen-save-button-top");
    await saveButton.click();

    await page.waitForURL(/\/party\/[0-9a-f-]{36}$/);
    sharedPartyPath = new URL(page.url()).pathname;

    // Copy the published party onto the investigation
    await openPartiesTab(page);
    await page.locator("#add-party-button").click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/add$/);

    await selectItemById("party-role-select", "Party of Interest", page);
    await selectItemById("party-type-select", "Organization", page);

    await page.locator("#businessName").fill(businessName);
    await page.locator("#businessNumber").fill(uniqueBusinessNumber);

    // Matching profiles are only searched once a match field is blurred; blur from the name field
    // so both filled values have settled by the time the blur handler reads them
    await page.locator("#businessName").click();
    await page.keyboard.press("Tab");

    const matchCard = page.locator(".comp-party-match-card", { hasText: businessName });
    await expect(matchCard).toBeVisible();
    await matchCard.getByRole("button", { name: "Select profile" }).click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[0-9a-f-]{36}$/);
    investigationPartyPath = new URL(page.url()).pathname;
    await expect(page.locator(".comp-box-complaint-id").getByText(businessName, { exact: true }).first()).toBeVisible();
  });

  test("it shows the alert and blocks editing once the shared party changes", async ({ page }) => {
    await page.goto(`${sharedPartyPath}/edit`);
    await waitForSpinner(page);

    // Change the published party, which leaves the copy on the investigation out of date
    const businessNameInput = page.locator("#businessName");
    await expect(businessNameInput).toHaveValue(businessName);
    await businessNameInput.fill(updatedBusinessName);

    const saveButton = page.locator("#details-screen-save-button-top");
    await saveButton.click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Party updated successfully" })).toBeVisible();
    await page.waitForURL(/\/party\/[0-9a-f-]{36}$/);

    await openPartiesTab(page);

    const partyCard = page.locator(".party-card--linked", { hasText: businessName }).first();
    const cardAlert = partyCard.locator("[id^=party-not-up-to-date-alert-]");
    await expect(cardAlert).toBeVisible();
    await expect(cardAlert).toContainText("changed as part of another investigation");

    const partyButton = page.getByRole("button", { name: businessName }).first();
    await partyButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[0-9a-f-]{36}$/);

    await expect(page.locator("#party-detail-not-up-to-date-alert")).toBeVisible();
    await expect(page.locator("#party-detail-edit-button")).toBeDisabled();
  });

  test("it pulls the shared changes and dismisses the alert", async ({ page }) => {
    await page.goto(investigationPartyPath);
    await waitForSpinner(page);

    const updateButton = page.locator("#party-detail-update-party-information-button");
    await expect(updateButton).toBeVisible();
    await updateButton.click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Party updated successfully" })).toBeVisible();

    await expect(page.locator("#party-detail-not-up-to-date-alert")).toHaveCount(0);
    await expect(
      page.locator(".comp-box-complaint-id").getByText(updatedBusinessName, { exact: true }).first(),
    ).toBeVisible();
    await expect(page.locator("#party-detail-edit-button")).toBeEnabled();
  });
});
