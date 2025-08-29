import { test, expect } from "@playwright/test";
import { navigateToDetailsScreen, waitForSpinner } from "../utils/helpers";
import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";

test.describe("CEEB user cannot access COS Enforcement", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.CEEB });

  test("CEEB user cannot access COS Enforcement", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890", false, page);
    await waitForSpinner(page);
    await expect(page).toHaveURL(/not-authorized/);
  });
});
