import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import {
  navigateToCreateScreen,
  navigateToTab,
  selectItemById,
  verifyMapMarkerExists,
  waitForSpinner,
} from "../../utils/helpers";

/*
Tests to verify complaint list specification functionality
*/
test.describe("Complaint Search Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  test("Can search Wildlife complaints for 'siblings '", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    //-- load the human wildlife conflicts
    await navigateToTab(complaintTypes[0], true, page);

    //-- open the filter tab
    await page.locator("#comp-filter-btn").click();

    //-- select 70 mile house community
    await selectItemById("community-select-id", "70 Mile House", page);
    await expect(page.locator("#comp-community-filter")).toBeVisible();

    //-- close the filter
    await page.locator("#comp-filter-btn").click();

    //-- there should be 3 complaints
    await expect(page.locator("#complaint-list tbody").locator("tr")).toHaveCount(3);

    //-- search for sibling and verify there's one complaint
    await page.locator("#complaint-search").click();
    await page.locator("#complaint-search").clear();
    await page.locator("#complaint-search").fill("sibling");
    await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
    await waitForSpinner(page);

    //-- verify one complaint, and verify complaint-id
    await expect(page.locator("#complaint-list tbody").locator("tr")).toHaveCount(1);
    await expect(page.locator("td", { hasText: "23-029788" }).first()).toBeVisible();
  });

  test("Can search Allegations for 'Oil' and clear search when done", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    //-- load the human wildlife conflicts
    await navigateToTab(complaintTypes[1], true, page);

    //-- there should be a whole page of complaints
    let rows = page.locator("#complaint-list tbody tr");
    expect(await rows.count()).toBeGreaterThanOrEqual(10);

    //-- search for Oil and verify there's at least 23 complaints (this may increase as new complaints are added from WebEOC)
    await page.locator("#complaint-search").click();
    await page.locator("#complaint-search").clear();
    await page.locator("#complaint-search").fill("Oil");
    await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
    await waitForSpinner(page);

    //-- verify one complaint, and verify complaint-id
    rows = page.locator("#complaint-list tbody tr");
    expect(await rows.count()).toBeGreaterThanOrEqual(23);

    //-- switch tabs
    await page.locator(complaintTypes[0]).click();

    //-- verify empty search
    await expect(page.locator("#complaint-search")).toHaveValue("");
  });

  test("Can't search Wildlife complaints for 'Zebra'", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    //-- load the human wildlife conflicts
    await navigateToTab(complaintTypes[0], true, page);

    //-- open the filter tab
    await page.locator("#comp-filter-btn").click();

    //-- select 70 mile house community
    await selectItemById("community-select-id", "70 Mile House", page);
    await expect(page.locator("#comp-community-filter")).toBeVisible();

    //-- close the filter
    await page.locator("#comp-filter-btn").click();

    //-- search for sibling and verify there's one complaint
    await page.locator("#complaint-search").click();
    await page.locator("#complaint-search").clear();
    await page.locator("#complaint-search").fill("Zebra");
    await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
    await waitForSpinner(page);

    //-- verify no complaints
    await expect(page.locator("#complaint-list tbody").locator("tr")).toContainText(
      "No complaints found using your current filters. Remove or change your filters to see complaints.",
    );
  });

  test("Can search wildlife map complaints by complaint-id: 23-031562", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    //-- load the human wildlife conflicts
    await navigateToTab(complaintTypes[0], true, page);

    //-- search for sibling and verify there's one complaint
    await page.locator("#complaint-search").click();
    await page.locator("#complaint-search").clear();
    await page.locator("#complaint-search").fill("23-031562");
    await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
    await waitForSpinner(page);

    //-- verify only one complaint
    await expect(page.locator("#complaint-list tbody").locator("tr")).toHaveCount(1);
    await expect(page.locator("#map_toggle_id")).toBeVisible();
    await page.locator('label[for="map_toggle_id"]').click();
    await verifyMapMarkerExists(true, page);
    const markerCount = await page.locator("#multi-point-map").locator(".leaflet-marker-icon").count();
    expect(markerCount == 1);
  });

  test("Can search multiple allegation map complaints: ", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    //-- load the human wildlife conflicts
    await navigateToTab(complaintTypes[1], false, page);

    //-- remove the zone filter
    await page.locator("#comp-zone-filter").click();
    await expect(page.locator("#comp-zone-filter")).not.toBeVisible();

    //-- open the filter tab
    await page.locator("#comp-filter-btn").click();

    //-- select east kootenay zone
    await selectItemById("zone-select-id", "East Kootenay", page);
    await expect(page.locator("#comp-zone-filter")).toBeVisible();
    await page.locator("#comp-filter-btn").click();

    //-- search for fire and verify there's multiple complaints
    await page.locator("#complaint-search").click();
    await page.locator("#complaint-search").clear();
    await page.locator("#complaint-search").fill("fire");
    await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
    await waitForSpinner(page);
    await expect(page.locator("#map_toggle_id")).toBeVisible();
    await page.locator('label[for="map_toggle_id"]').click();
    await verifyMapMarkerExists(true, page);
    const markerCount = await page.locator("#multi-point-map").locator(".leaflet-marker-icon").count();
    expect(markerCount == 5);
  });

  test("Can retains search parameters when navigating back to the search page", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    //-- load the ERS conflicts and set filters
    await navigateToTab(complaintTypes[1], false, page);
    await page.locator("#comp-zone-filter").click();
    await waitForSpinner(page);
    await expect(page.locator("#comp-zone-filter")).not.toBeVisible();
    await page.locator("#comp-filter-btn").click();
    await selectItemById("region-select-filter-id", "Okanagan", page);
    await expect(page.locator("#comp-region-filter")).toBeVisible();
    await page.locator("#complaint-search").click();
    await page.locator("#complaint-search").clear();
    await page.locator("#complaint-search").fill("wildlife");
    await page.locator("#complaint-search").press("Enter"); //-- {enter} will perform an enter keypress
    await waitForSpinner(page);

    // At this point, we need to wait for the map to complete loading to continue the test
    // Intercept calls that contain a GET request with a request path containing /api/customer/
    await expect(page.locator("#map_toggle_id")).toBeVisible();
    await page.locator('label[for="map_toggle_id"]').click();
    await verifyMapMarkerExists(true, page);
    let markerCount = await page.locator("#multi-point-map").locator(".leaflet-marker-icon").count();
    expect(markerCount == 2);

    // Navigate to a different page, and return to then complaints page
    await navigateToCreateScreen(page);
    await expect(page.locator("#details-screen-cancel-edit-button-top")).toBeVisible();
    await page.locator("#icon-complaints-link").click();

    // Verify that the search parameters set before leaving the page were retained
    await expect(page.locator("#complaint-search")).toHaveValue("wildlife");
    await verifyMapMarkerExists(true, page);
    await expect(page.locator("#comp-region-filter").getByText("Okanagan").first()).toBeVisible();
    markerCount = await page.locator("#multi-point-map").locator(".leaflet-marker-icon").count();
    expect(markerCount == 2);
  });
});
