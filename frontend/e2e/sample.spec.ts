import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "./utils/authConfig";

test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
test("COS test", async ({ page }) => {
  // page is authenticated as a COS user
  await page.goto("/");
  await expect(page.getByPlaceholder("Search...")).toBeVisible();
});
