import { expect, Page } from "@playwright/test";

export const slowExpect = expect.configure({ timeout: 30000 });

export async function waitForSpinner(page: Page) {
  await slowExpect(page.locator(".comp-loader-overlay")).toBeVisible();
  await slowExpect(page.locator(".comp-loader-overlay")).not.toBeVisible();
}

export async function navigateToDetailsScreen(
  complaintType: string,
  complaintIdentifier: string,
  navigateByURL: boolean,
  page: Page,
) {
  if (navigateByURL) {
    await page.goto(`/complaint/${complaintType.toUpperCase()}/${complaintIdentifier}`, {
      waitUntil: "commit",
    }); //errors happen without converting to upper case!
  } // go to the list, remove filters and find complaint (must be sure it will be in the first 50 results)
  else {
    //-- navigate to application root
    await page.goto("/", {
      waitUntil: "commit",
    });

    //Need to make sure the filters are loaded before switching tabs.
    await waitForSpinner(page);

    //-- click on HWCR tab
    await page.locator(`#${complaintType.toLowerCase()}-tab`).click();
    await expect(page.locator("#comp-zone-filter")).toBeVisible();
    await page.locator("#comp-zone-filter").click(); //clear zone filter so this complaint is in the list view
    await expect(page.locator("#comp-zone-filter")).not.toBeVisible();
    await waitForSpinner(page);
    await expect(page.locator("#comp-status-filter")).toBeVisible();
    await page.locator("#comp-status-filter").click(); //clear status filter so this complaint is in the list view
    await expect(page.locator("#comp-status-filter")).not.toBeVisible();
    await waitForSpinner(page);

    //-- check to make sure there are items in the table
    await expect(page.locator("#complaint-list").locator("tr").count()).toBeGreaterThan(0);
    await page.locator("#complaint-list > tbody > tr").getByText(complaintIdentifier).first().click();
    await waitForSpinner(page);
  }
}

export async function assignSelfToComplaint(page: Page) {
  await page.locator("#details-screen-assign-button").click();
  await page.locator("#self_assign_button").click();
}

export async function hasErrorMessage(page: Page, inputs: Array<string>, toastText?: string) {
  //validate all the inputs
  inputs.forEach(async (input) => {
    await expect(page.locator(input).locator(".error-message")).toBeVisible();
  });

  //validate the toast
  if (toastText) {
    const $toast = page.locator(".Toastify__toast-body");
    expect($toast).toHaveText(toastText);
  }
}
