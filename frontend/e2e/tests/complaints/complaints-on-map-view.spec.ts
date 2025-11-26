import { test, expect } from "@playwright/test";
import { selectItemById, waitForSpinner } from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
test.describe("Complaints on map tests", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  // perform the same test on each of the tabs (HWCR and ERS)
  for (const type of complaintTypes) {
    test(`Verify filters work and are maintained for: ${type}`, async ({ page }) => {
      await page.goto("/");
      await waitForSpinner(page);
      await page.locator(type).click();

      // switch to map view
      await expect(page.locator("#map_toggle_id")).toBeVisible();
      await page.locator('label[for="map_toggle_id"]').click();

      // wait for the map to load

      // verify default filters
      await expect(page.locator("#comp-status-filter")).toBeVisible();
      await expect(page.locator("#comp-zone-filter")).toBeVisible();
      await page.locator("#comp-zone-filter").click(); //clear zone filter so this complaint is in the list view

      // verify no other filters exist
      await expect(page.locator("#comp-officer-filter")).not.toBeVisible();
      await expect(page.locator("#comp-community-filter")).not.toBeVisible();
      await expect(page.locator("#comp-region-filter")).not.toBeVisible();

      if ("#hwcr-tab".includes(type)) {
        await expect(page.locator("#comp-species-filter")).not.toBeVisible();
        await expect(page.locator("#comp-nature-of-complaint-filter")).not.toBeVisible();
      } else {
        await expect(page.locator("#comp-violation-filter")).not.toBeVisible();
      }

      // find how many markers there are, we'll compare this to the count after another filter is applied
      const complaintCountWithoutFilters = page.locator(".leaflet-marker-icon").count();
      await page.locator("#comp-filter-btn").click();

      if ("#hwcr-tab".includes(type)) {
        // add the hwcr filters
        // add the region filter
        await selectItemById("region-select-filter-id", "Thompson Cariboo", page);
        await selectItemById("zone-select-id", "Cariboo Thompson", page);
        await selectItemById("community-select-id", "Blue River", page);
        await selectItemById("nature-of-complaint-select-id", "Food Conditioned", page);
        await selectItemById("species-select-id", "Black Bear", page);
      } else {
        // add the alegation filters
        // add the region filter
        await selectItemById("region-select-filter-id", "Okanagan", page);
        await selectItemById("zone-select-id", "North Okanagan", page);
        await selectItemById("community-select-id", "Grindrod", page);
        await selectItemById("violation-type-select-id", "Dumping", page);
      }

      // count the markers again, they should now have a different count
      const complaintCountWithFilters = await page.locator(".leaflet-marker-icon").count();
      expect(complaintCountWithFilters).not.toBe(complaintCountWithoutFilters);

      // switch back to list view to verify filters are still applied
      await page.locator('label[for="list_toggle_id"]').click();

      // verify the filters still exits
      await expect(page.locator("#comp-status-filter")).toBeVisible();
      await expect(page.locator("#comp-zone-filter")).toBeVisible();
      await expect(page.locator("#comp-community-filter")).toBeVisible();
      await expect(page.locator("#comp-region-filter")).toBeVisible();

      if ("#hwcr-tab".includes(type)) {
        // add the hwcr filters
        await expect(page.locator("#comp-species-filter")).toBeVisible();
        await expect(page.locator("#comp-nature-of-complaint-filter")).toBeVisible();
      } else {
        await expect(page.locator("#comp-violation-filter")).toBeVisible();
      }
    });

    // test to verify that user can switch to map view and click a marker to see popup
    test(`Switch to ${type} map view and click marker`, async ({ page }) => {
      await page.goto("/");
      await waitForSpinner(page);
      await page.locator(type).click();
      await expect(page.locator("#comp-zone-filter")).toBeVisible();
      await page.locator("#comp-zone-filter").click(); //clear status filter so this complaint is in the list view
      await expect(page.locator("#list_toggle_id")).toBeVisible();
      await expect(page.locator("#map_toggle_id")).toBeVisible(); //verifies that the list/map toggle button appears.  Click the map view
      await page.locator('label[for="map_toggle_id"]').click();

      // wait for the map to load
      await page.locator("#comp-filter-btn").click();
      await selectItemById("community-select-id", "Kelowna", page);

      // wait for the map to load
      await expect(page.locator("div.leaflet-container")).toHaveCount(1);
      await expect(page.locator(".leaflet-popup")).toHaveCount(0);

      const markerCluster = page.locator(".marker-cluster");
      await expect(markerCluster.first()).toBeVisible();
      await markerCluster.first().click({ force: true });
      await page.locator(".leaflet-marker-icon.map-marker svg").first().click();

      // wait for the popup to load
      await expect(page.locator(".leaflet-popup")).toBeVisible();
      await expect(page.locator(".comp-summary-popup-location em")).toBeVisible();
      await expect(await page.locator(".comp-summary-popup-location em")).toContainText("Kelowna");

      // click the "view details" button to navigate to the complaint

      await page.locator("#view-complaint-details-button-id").click();
      await waitForSpinner(page);
    });

    test(`Verify banner is displayed when no ${type} results`, async ({ page }) => {
      await page.goto("/");
      await waitForSpinner(page);
      await page.locator(type).click();

      // switch to map view
      await expect(page.locator("#map_toggle_id")).toBeVisible();
      await page.locator('label[for="map_toggle_id"]').click();

      // wait for the map to load

      // verify default filters
      await expect(page.locator("#comp-status-filter")).toBeVisible();
      await expect(page.locator("#comp-zone-filter")).toBeVisible();
      await page.locator("#comp-zone-filter").click(); //clear zone filter so this complaint is in the list view

      // verify no other filters exist
      await expect(page.locator("#comp-officer-filter")).not.toBeVisible();
      await expect(page.locator("#comp-community-filter")).not.toBeVisible();
      await expect(page.locator("#comp-region-filter")).not.toBeVisible();

      if ("#hwcr-tab".includes(type)) {
        await expect(page.locator("#comp-species-filter")).not.toBeVisible();
        await expect(page.locator("#comp-nature-of-complaint-filter")).not.toBeVisible();
      } else {
        await expect(page.locator("#comp-violation-filter")).not.toBeVisible();
      }

      //-- search for sibling and verify there's one complaint
      await page.locator("#complaint-search").click();
      await page.locator("#complaint-search").clear();
      await page.locator("#complaint-search").fill("123456789qawsedrftg");
      await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
      await expect(page.locator("#complaint-no-results-notification")).toBeVisible();
    });
  }
});
