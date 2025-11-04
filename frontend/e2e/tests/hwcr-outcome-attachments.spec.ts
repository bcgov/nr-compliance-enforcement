import { test } from "@playwright/test";

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import { navigateToDetailsScreen, verifyAttachmentsCarousel } from "../utils/helpers";

test.describe("Display HWCR Outcome Attachments", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("outcomes attachments is displayed", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
    await verifyAttachmentsCarousel(page, true, "outcome-attachments");
  });
});
