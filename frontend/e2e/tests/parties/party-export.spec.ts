import { test, expect, type Page } from "@playwright/test";
import { format } from "date-fns";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById } from "../../utils/helpers";

/**
 * Tests for exporting a party profile to PDF
 * Verifies a shared person, a shared organization and an investigation party each download
 * with the NatSuite_Party_[Name]_[Date].pdf file name
 */
const expectedFileName = (fileNamePart: string) => `NatSuite_Party_${fileNamePart}_${format(new Date(), "yyMMdd")}.pdf`;

// Clicks Export and checks the downloaded file name; the button is re-enabled once the PDF has downloaded
const exportAndCheckFileName = async (page: Page, fileName: string) => {
  const exportButton = page.locator("#party-detail-export-button");

  // Start waiting for download before clicking. Note no await.
  const downloadPromise = page.waitForEvent("download");
  await exportButton.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe(fileName);
  await expect(exportButton).toBeEnabled();

  // Be sure to delete the files after every run by modifying this test if saving the file.
  await download.delete();
};

test.describe("Export Party Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  // Seeded shared parties (migration-shared/test-only-migrations/R__data_parties.sql)
  const sharedParties = [
    {
      partyType: "person",
      partyGuid: "6c65e099-7c32-429b-abdf-c5ccda9c9779",
      title: "SCOTT, Michael",
      fileNamePart: "SCOTT_Michael",
    },
    {
      partyType: "organization",
      partyGuid: "a5b8fad3-28cf-48b1-af7a-05d0c91fa4d9",
      title: "Nexus",
      fileNamePart: "Nexus",
    },
  ];

  for (const party of sharedParties) {
    test(`Can export a shared ${party.partyType} party`, async ({ page }) => {
      await page.goto(`party/${party.partyGuid}`);
      await expect(
        page.locator(".comp-box-complaint-id").getByText(party.title, { exact: true }).first(),
      ).toBeVisible();

      await exportAndCheckFileName(page, expectedFileName(party.fileNamePart));
    });
  }
});

test.describe("Export Investigation Party Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  // Not used by other tests, so adding and removing a party here can't collide with them
  const INVESTIGATION_PATH = "investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f202/";
  const PARTY_NAME = "EXPORT, Test";

  const openPartiesTab = async (page: Page) => {
    await page.goto(INVESTIGATION_PATH);
    await expect(page.locator("h1.comp-box-complaint-id")).not.toContainText("Unknown", { timeout: 15000 });
    await page.locator("#parties").click();
  };

  // Remove only the party this test added, so the investigation doesn't accumulate duplicates
  const removeExportParty = async (page: Page) => {
    await openPartiesTab(page);
    const partyCards = page.locator(".party-card--linked", { hasText: PARTY_NAME });
    let count = await partyCards.count();
    while (count > 0) {
      await partyCards.first().getByRole("button", { name: "Remove" }).click();

      const confirmModal = page.locator(".modal").first();
      await expect(confirmModal).toBeVisible();
      await confirmModal.locator("button", { hasText: "Yes, remove party" }).click();

      await expect(partyCards).toHaveCount(count - 1, { timeout: 10000 });
      count = await partyCards.count();
    }
  };

  // Runs even when the test fails
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const page = await context.newPage();
    await removeExportParty(page);
    await context.close();
  });

  test("Can export an investigation party", async ({ page }) => {
    await openPartiesTab(page);

    await page.locator("#add-party-button").click();
    await page.waitForURL(/\/investigation\/[^/]+\/party\/add$/);

    await selectItemById("party-type-select", "Person", page);
    await page.locator("#FirstName").fill("Test");
    await page.locator("#LastName").fill("Export");
    await selectItemById("party-role-select", "Party of Interest", page);
    await page.locator("#party-save-button").click();

    await page.waitForURL(/\/investigation\/[^/]+\/party\/[^/]+$/);
    await expect(page.locator(".comp-box-complaint-id").getByText(PARTY_NAME, { exact: true }).first()).toBeVisible();

    await exportAndCheckFileName(page, expectedFileName("EXPORT_Test"));
  });
});
