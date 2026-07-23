import { test, expect, type Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById } from "../../utils/helpers";

/**
 * Tests for Investigation Party functionality
 * Verifies parties can be searched and added, created as local parties,
 * and edited within an investigation
 */
test.describe("Investigation Party Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" });

  const INVESTIGATION_PATH = "investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f200/";

  const openPartiesTab = async (page: Page) => {
    await page.goto(INVESTIGATION_PATH);
    await expect(page.locator("h1.comp-box-complaint-id")).not.toContainText("Unknown", { timeout: 15000 });
    await page.locator("#parties").click();
  };

  // Remove parties so that the investigation doesn't accumulate duplicate parties
  const removeAllParties = async (page: Page) => {
    await openPartiesTab(page);
    const partyItems = page.locator(".party-accordion .list-group-item");
    let count = await partyItems.count();
    while (count > 0) {
      await partyItems.first().locator(".dropdown-toggle-no-caret").click();
      await page.locator(".dropdown-item", { hasText: "Remove" }).click();

      const confirmModal = page.locator(".modal").first();
      await expect(confirmModal).toBeVisible();
      await confirmModal.locator("button", { hasText: "Yes, remove party" }).click();

      await expect(partyItems).toHaveCount(count - 1, { timeout: 10000 });
      count = await partyItems.count();
    }
  };

  test.beforeEach(async ({ page }) => {
    await openPartiesTab(page);
  });

  // Runs even when a test fails
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const page = await context.newPage();
    await removeAllParties(page);
  });

  test("it adds a new local person party to investigation", async ({ page }) => {
    const addPartyButton = page.locator("#add-party-button");
    await addPartyButton.click();

    // "Add party" navigates to the full-page party form
    await page.waitForURL(/\/investigation\/[^/]+\/party\/add$/);

    // Select party type - Person
    await selectItemById("party-type-select", "Person", page);

    // Fill in person fields
    const firstNameInput = page.locator("#FirstName");
    await firstNameInput.fill("Jane");

    const lastNameInput = page.locator("#LastName");
    await lastNameInput.fill("Doe");

    // Select a party association role
    await selectItemById("party-role-select", "Party of Interest", page);

    // Save
    const saveButton = page.locator("#party-save-button");
    await saveButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+$/);
    await expect(page.locator(".comp-box-complaint-id").getByText("DOE, Jane", { exact: true }).first()).toBeVisible();
  });

  test("it adds a new local business party to investigation", async ({ page }) => {
    const addPartyButton = page.locator("#add-party-button");
    await addPartyButton.click();
    let randomBusinessNumber = Math.random().toString().substring(2, 10);

    await page.waitForURL(/\/investigation\/[^/]+\/party\/add$/);

    // Select party type - Business
    await selectItemById("party-type-select", "Company", page);

    // Fill in business name
    const businessNameInput = page.locator("#businessName");
    await businessNameInput.fill("Acme Logging Ltd");

    // Business number is optional, let's enter one anyways
    const businessNumberInput = page.locator("#businessNumber");
    await businessNumberInput.fill(randomBusinessNumber);

    // Select a party association role
    await selectItemById("party-role-select", "Party of Interest", page);

    // Save
    const saveButton = page.locator("#party-save-button");
    await saveButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+$/);
    await expect(
      page.locator(".comp-box-complaint-id").getByText("Acme Logging Ltd", { exact: true }).first(),
    ).toBeVisible();
  });

  test("it edits a person party", async ({ page }) => {
    // Find a person party in the list and access the details page
    const personItem = page.locator(".party-card", { has: page.locator(".bi-person") }).first();
    await expect(personItem).toBeVisible();

    const partyButton = page.getByRole("button", { name: "DOE, Jane" }).first();
    await partyButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+$/);

    //Edit the person
    const editButton = page.locator("#party-detail-edit-button");
    await editButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+\/edit$/);

    // Edit the sex code
    await selectItemById("sex-select", "M", page);

    // Save
    const saveButton = page.locator("#party-save-button");
    await saveButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+$/);
    await expect(page.locator(".comp-box-complaint-id").getByText("DOE, Jane", { exact: true }).first()).toBeVisible();
  });
});
