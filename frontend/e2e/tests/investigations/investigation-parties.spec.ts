import { test, expect } from "@playwright/test";
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

  test.beforeEach(async ({ page }) => {
    await page.goto("investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f200/");

    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Click Parties tab
    const partiesButton = page.locator("#parties");
    await partiesButton.click();
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

    await expect(page.locator(".party-list").getByText("Doe, Jane", { exact: true })).toBeVisible();
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

    // Business number is required for Company parties
    const businessNumberInput = page.locator("#businessNumber");
    // Generate a random business number to avoid clashes
    await businessNumberInput.fill(randomBusinessNumber);

    // Select a party association role
    await selectItemById("party-role-select", "Party of Interest", page);

    // Save
    const saveButton = page.locator("#party-save-button");
    await saveButton.click();

    await expect(page.locator(".party-list").getByText("Acme Logging Ltd", { exact: true })).toBeVisible();
  });

  test("it edits a person party", async ({ page }) => {
    // Find a person party in the list and open the kebab menu
    const personItem = page.locator(".party-card", { has: page.locator(".bi-person") }).first();
    await expect(personItem).toBeVisible();

    const kebabMenu = personItem.locator(".comp-kebab-toggle");
    await kebabMenu.click();

    const editButton = personItem.locator(".dropdown-item", { hasText: "Edit" });
    await editButton.click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+\/edit$/);

    // Edit the sex code
    await selectItemById("gender-select", "Man/boy", page);

    // Save
    const saveButton = page.locator("#party-save-button");
    await saveButton.click();

    await expect(page.locator(".party-list").getByText("Doe, Jane", { exact: true })).toBeVisible();
  });

  test("cleanup - remove all test parties from investigation", async ({ page }) => {
    // Remove all parties by clicking the kebab menu and selecting Remove for each one
    // Loop until no more parties remain
    const removeParties = async () => {
      const partyItems = page.locator(".party-accordion .list-group-item");
      const count = await partyItems.count();

      if (count === 0) return;

      const kebabMenu = partyItems.first().locator(".dropdown-toggle-no-caret");
      await kebabMenu.click();

      const removeButton = page.locator(".dropdown-item", { hasText: "Remove" });
      await removeButton.click();

      const confirmModal = page.locator(".modal").first();
      await expect(confirmModal).toBeVisible();
      const confirmButton = confirmModal.locator("button", { hasText: "Yes, remove party" });
      await confirmButton.click();

      // Wait for the list to update before trying the next one
      await expect(partyItems).toHaveCount(count - 1, { timeout: 10000 });

      await removeParties();
    };

    await removeParties();

    // Verify no parties remain
    const remainingParties = page.locator(".party-accordion .list-group-item");
    await expect(remainingParties).toHaveCount(0, { timeout: 10000 });
  });
});
