import test from "@playwright/test";
import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import {
  isHeaderinViewPort,
  navigateToCreateScreen,
  navigateToDetailsScreen,
  navigateToEditScreen,
  waitForSpinner,
} from "../../utils/helpers";

/*
Tests to verify complaint list specification functionality
*/
test.describe("Sticky Headers", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("Verifies that the Create Header is sticky", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);
    await navigateToCreateScreen(page);

    //scroll to the bottom of the page
    await page.locator(".comp-main-content").scrollIntoViewIfNeeded(); // Scroll 'sidebar' to its bottom
    await isHeaderinViewPort(page);
  });

  test("Verifies that the Details Header is sticky", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);

    //scroll to the bottom of the page
    await page.locator(".comp-main-content").scrollIntoViewIfNeeded(); // Scroll 'sidebar' to its bottom
    await isHeaderinViewPort(page);
  });

  test("Verifies that the Edit Header is sticky", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);

    //scroll to the bottom of the page
    await page.locator(".comp-main-content").scrollIntoViewIfNeeded(); // Scroll 'sidebar' to its bottom
    await isHeaderinViewPort(page);
  });
});
