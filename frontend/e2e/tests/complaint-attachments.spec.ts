import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import {
  navigateToCreateScreen,
  navigateToDetailsScreen,
  navigateToEditScreen,
  verifyAttachmentsCarousel,
} from "../utils/helpers";

/*
Tests to verify complaint attachments
*/
test.describe("Complaint Attachments", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  for (const type of complaintTypes) {
    test(`Verifies that the ${type} attachments appear`, async ({ page }) => {
      if ("#hwcr-tab".includes(type)) {
        await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
      } else {
        await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);
      }
      await verifyAttachmentsCarousel(page, false, "complaint_attachments_div_id");
    });

    test(`Verifies that upload option exists on ${type} edit page`, async ({ page }) => {
      if ("#hwcr-tab".includes(type)) {
        await navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
      } else {
        await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);
      }

      // should be able to upload on details view
      await expect(page.locator(".comp-attachment-upload-btn")).toBeVisible();
    });
  }

  test("Verifies that upload option exists on the create page", async ({ page }) => {
    await navigateToCreateScreen(page);
    await expect(page.locator(".comp-attachment-upload-btn")).toBeVisible();
  });
});
