import { test, expect, type Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for updating an investigation party from the shared party it was published to
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

  // Captured from the urls and responses the tests land on, then reused by the tests that follow
  let sharedPartyPath = "";
  let investigationPartyPath = "";

  const openInvestigationTab = async (page: Page, tab: "parties" | "contraventions") => {
    await page.goto(INVESTIGATION_PATH);
    await expect(page.locator("h1.comp-box-complaint-id")).not.toContainText("Unknown", { timeout: 15000 });
    await page.locator(`#${tab}`).click();
  };

  // Remove the party this spec added so the investigation doesn't accumulate duplicate parties
  const removeInvestigationParty = async (page: Page) => {
    await openInvestigationTab(page, "parties");
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

  test("it publishes a party by recording a decision against it", async ({ page }) => {
    // Add a local business party with everything a decision needs: name, business number and a primary address
    await openInvestigationTab(page, "parties");
    await page.locator("#add-party-button").click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/add$/);

    await selectItemById("party-role-select", "Party of Interest", page);
    await selectItemById("party-type-select", "Organization", page);

    await page.locator("#businessName").fill(businessName);
    await page.locator("#businessNumber").fill(uniqueBusinessNumber);

    // The first address added is marked primary
    await page.locator("#add-address-button").click();
    await page.locator("#address-name-0").fill("Head office");
    await page.locator("#address-0").fill("123 Main Street");
    await page.locator("#city-0").fill("Victoria");

    await page.locator("#party-save-button").click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[0-9a-f-]{36}$/);
    investigationPartyPath = new URL(page.url()).pathname;
    await expect(page.locator(".comp-box-complaint-id").getByText(businessName, { exact: true }).first()).toBeVisible();

    // Add a contravention against the party
    await openInvestigationTab(page, "contraventions");
    await page.getByRole("button", { name: "Add contravention" }).click();

    const contraventionModal = page.locator(".modal").first();
    await expect(contraventionModal).toBeVisible();

    // The 1st of this month is on or before today, so it passes the max date
    await enterDateTimeInDatePicker(page, "contravention-date", "01");

    await selectItemById("party-select", businessName, page);
    // The Forest Act is the only legislation source enabled in the test data
    await selectItemById("act-select", "Forest Act", page);
    await selectItemById("section-select", "1 Definitions and interpretation", page);
    await contraventionModal.getByLabel("Definitions and interpretation").first().check();

    const createContraventionPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") &&
        (response.request().postData()?.includes("CreateContravention") ?? false),
      { timeout: 15000 },
    );
    await contraventionModal.getByRole("button", { name: "Save" }).click();
    await createContraventionPromise;
    await expect(contraventionModal).toBeHidden();

    // Record a warning against it, which publishes the party. Dates default to today and the
    // officers default to the investigation's primary investigator
    const partyGroup = page.locator("div.mb-4", {
      has: page.locator(".investigation-party-name", { hasText: businessName }),
    });
    await partyGroup.getByRole("button", { name: "Add decision" }).first().click();

    const decisionModal = page.locator(".modal").first();
    await expect(decisionModal).toBeVisible();
    await expect(decisionModal.locator("#enforcement-action-publish-party-notice")).toBeVisible();

    await selectItemById("enforcement-action-code", "Warning", page);
    await page.locator("#enforcement-action-warningNumber").fill(`W${uniqueBusinessNumber}`);

    const createDecisionPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") &&
        (response.request().postData()?.includes("CreateEnforcementAction") ?? false),
      { timeout: 15000 },
    );
    await decisionModal.getByRole("button", { name: "Save" }).click();

    const createDecisionResponse = await createDecisionPromise;
    const createDecisionBody = await createDecisionResponse.json();
    const publishedPartyReference = createDecisionBody?.data?.createEnforcementAction?.publishedPartyReference;
    expect(publishedPartyReference).toBeTruthy();
    sharedPartyPath = `/party/${publishedPartyReference}`;

    await expect(page.locator(".Toastify__toast-body", { hasText: "Decision and party details saved" })).toBeVisible();
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

    await openInvestigationTab(page, "parties");

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
