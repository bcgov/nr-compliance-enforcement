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

  test("it searches for an existing party and adds to investigation", async ({ page }) => {
    const addPartyButton = page.locator("#add-party-button");
    await addPartyButton.click();

    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();

    // Default mode is "Search existing party" — type in the search box
    const searchInput = modal.locator(".rbt-input-text");
    await searchInput.pressSequentially("Pure", { delay: 100 });

    // Wait for search results and select the first one
    const menuItem = page.locator(".rbt-menu .dropdown-item").first();
    await expect(menuItem).toBeVisible({ timeout: 10000 });
    await menuItem.click();

    // Select a party association role
    await selectItemById("party-role-select", "Party of Interest", page);

    // Save
    const saveButton = modal.locator("#add-party-save-button");
    await saveButton.click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Party added successfully" })).toBeVisible();
  });

  test("it adds a new local person party to investigation", async ({ page }) => {
    const addPartyButton = page.locator("#add-party-button");
    await addPartyButton.click();

    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();

    // Switch to "Create new party" mode
    const createRadio = modal.locator("#mode-create");
    await createRadio.click();

    // Select party type - Person
    await selectItemById("party-type-select", "Person", page);

    // Fill in person fields
    const firstNameInput = modal.locator("#FirstName");
    await firstNameInput.fill("Jane");

    const lastNameInput = modal.locator("#LastName");
    await lastNameInput.fill("Doe");

    // Select a party association role
    await selectItemById("party-role-select", "Party of Interest", page);

    // Save
    const saveButton = modal.locator("#add-party-save-button");
    await saveButton.click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Party added successfully" })).toBeVisible();
  });

  test("it adds a new local business party to investigation", async ({ page }) => {
    const addPartyButton = page.locator("#add-party-button");
    await addPartyButton.click();

    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();

    // Switch to "Create new party" mode
    const createRadio = modal.locator("#mode-create");
    await createRadio.click();

    // Select party type - Business
    await selectItemById("party-type-select", "Company", page);

    // Fill in business name
    const businessNameInput = modal.locator("#businessName");
    await businessNameInput.fill("Acme Logging Ltd");

    // Select a party association role
    await selectItemById("party-role-select", "Party of Interest", page);

    // Save
    const saveButton = modal.locator("#add-party-save-button");
    await saveButton.click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Party added successfully" })).toBeVisible();
  });

  test("it edits a person party", async ({ page }) => {
    // Find a person party in the list and open the kebab menu
    const personItem = page.locator(".party-accordion .list-group-item").first();
    await expect(personItem).toBeVisible();

    const kebabMenu = personItem.locator(".dropdown-toggle-no-caret");
    await kebabMenu.click();

    const editButton = page.locator(".dropdown-item", { hasText: "Edit" });
    await editButton.click();

    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();

    // Edit the sex code
    await selectItemById("sex-select", "Male", page);

    // Save
    const saveButton = modal.locator("#add-party-save-button");
    await saveButton.click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Party updated successfully" })).toBeVisible();
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
