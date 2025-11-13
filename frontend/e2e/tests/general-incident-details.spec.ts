import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import { navigateToDetailsScreen, verifyMapMarkerExists, waitForSpinner } from "../utils/helpers";

test.describe("COMPENF-37 Display ECR Details", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const callDetails = {
    description: "Test information on a CO Contact General Incident Type",
    location: "Cariboo Dr",
    locationDescription: "tester call description 8",
    incidentTime: "2024-07-11T14:18:00.000Z",
    community: "Victoria",
    office: "Victoria",
    zone: "South Island",
    region: "West Coast",
    violationInProgress: false,
    violationObserved: false,
  };

  test("it has records in table view", async ({ page }) => {
    //-- navigate to application root
    await page.goto("/");

    //-- click on General Incident tab
    await page.locator("#gir-tab").click();
    await waitForSpinner(page);

    //-- check to make sure there are items in the table
    await expect(await page.locator("#complaint-list").locator("tr").count()).toBeGreaterThan(0);
  });

  test("it can select record", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", false, page);
    await waitForSpinner(page);
    //-- verify the right complaint identifier is selected and the animal type
    await expect(
      await page
        .locator(".comp-box-complaint-id")
        .getByText(/23-900001/)
        .first(),
    ).toBeVisible();
  });

  test("it has correct call details", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true, page);
    await waitForSpinner(page);

    //-- verify the call details block
    await expect(
      await page.locator('pre[id="comp-details-description"]', { hasText: callDetails.description }).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-location"]', { hasText: callDetails.location }).first(),
    ).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-details-location-description"]', { hasText: callDetails.locationDescription })
        .first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-community"]', { hasText: callDetails.community }).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-office"]', { hasText: callDetails.office }).first(),
    ).toBeVisible();
    await expect(await page.locator('dd[id="comp-details-zone"]', { hasText: callDetails.zone }).first()).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-region"]', { hasText: callDetails.region }).first(),
    ).toBeVisible();
  });

  test("it has a map on screen with no marker", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true, page);
    await waitForSpinner(page);
    await verifyMapMarkerExists(false, page);
    await expect(await page.locator(".comp-complaint-details-alert")).toBeVisible();
  });

  test("validates breadcrumb styles", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true, page);
    await waitForSpinner(page);
    await expect(page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("text-decoration", /.*/);
    await expect(page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("text-decoration", "underline");
    await expect(page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("color", /.*/);
    await expect(page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("color", "rgb(255, 255, 255)");
  });

  test("allows users to add additional notes", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true, page);
    await waitForSpinner(page);

    // Delete any note records if they exist
    const $notes = page.locator("#outcome-note");
    while ((await $notes.locator("#notes-delete-button").count()) > 0) {
      // Always select the *first* delete button
      await $notes.locator("#notes-delete-button").first().click();

      await page.locator(".modal-footer .btn-primary").click();

      // Confirm deletion in modal
      await expect(
        page.locator(".Toastify__toast-body", {
          hasText: "Note deleted",
        }),
      ).toBeVisible();

      await expect(
        page.locator(".Toastify__toast-body", {
          hasText: "Note deleted",
        }),
      ).toBeHidden({ timeout: 10000 });
    }

    await page.locator("#outcome-report-add-note").click();
    await page.locator("#supporting-notes-textarea-id").click();
    await page.locator("#supporting-notes-textarea-id").clear();
    await page.locator("#supporting-notes-textarea-id").fill("A");
    await page.locator("#supporting-notes-save-button").click();
    await waitForSpinner(page);
    await expect(await page.locator("#additional-note-text", { hasText: "A" }).first()).toBeVisible();
    await page.locator("#notes-delete-button").click();
    await page.locator("#confirm-delete-note-button").first().click();
    await waitForSpinner(page);
    await expect(page.locator("#outcome-report-add-note")).toBeVisible();
  });
});
