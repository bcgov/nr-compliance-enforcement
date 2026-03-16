import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { test, expect, Page } from "@playwright/test";
import { assignSelfToComplaint, hasErrorMessage, navigateToDetailsScreen, waitForSpinner } from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

const complaintTypes = [COMPLAINT_TYPES.HWCR, COMPLAINT_TYPES.ERS];

async function enterReferenceNumber(page, number: string, shouldSave: boolean) {
  await page.locator("#external-file-reference-number-input").click();
  await page.locator("#external-file-reference-number-input").clear();
  await page.locator("#external-file-reference-number-input").pressSequentially(number, { delay: 0 });
  if (shouldSave) {
    await page.locator("#external-file-reference-save-button").click();
  }
  await page.locator("#external-file-reference-delete-button");
}
async function navigateToComplaint(page: Page, type) {
  if (COMPLAINT_TYPES.HWCR === type) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-031226", true, page);
  } else {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-027918", true, page);
  }
}
async function deleteReferenceNumber(page: Page) {
  if (await page.locator("#external-file-reference-delete-button").isVisible()) {
    await page.locator("#external-file-reference-delete-button").first().click();
    await page.locator(".modal-footer > .btn-primary").click();
    await waitForSpinner(page);
  } else {
    console.log("No reference number to delete");
  }
}

async function validateFormIsEmpty(page: Page) {
  await expect(page.locator("#external-file-reference-number-input")).toBeVisible();
  await expect(async () => {
    const $div = page.locator("#external-file-reference-number-div");
    await expect($div).not.toHaveText("111111");
    await expect($div).not.toHaveText("222222");
    await expect($div).not.toHaveText("333333");
  }).toPass();
}

async function setStatusOpen(page: Page) {
  await page.locator("#details-screen-update-status-button").locator(":visible:scope").click();
  await page.locator("#complaint_status_dropdown").click();
  await page.locator(".comp-select__option").getByText(/Open/).first().click();
  await page.locator("#update_complaint_status_button").click();
  await expect(page.locator("#update_complaint_status_button")).not.toBeVisible();
}

complaintTypes.forEach((type) => {
  test.describe(`Test external file reference behaviour for ${type}`, () => {
    test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
    test.describe.configure({ mode: "serial" });

    test(`Can enter an external reference number: ${type}`, async ({ page }) => {
      //navigatetoComplaint
      await navigateToComplaint(page, type);
      await waitForSpinner(page);

      // ERS for COS need to be assigned before a COORS number can be saved
      if (type === COMPLAINT_TYPES.ERS) {
        await setStatusOpen(page);
        await assignSelfToComplaint(page);
      }

      //make sure that there isn't an old one there from a failed run
      await deleteReferenceNumber(page);

      //enter the number
      await enterReferenceNumber(page, "111111", true);

      //validate the number
      await expect(page.locator("#external-file-reference-number")).toHaveText("111111");

      // ERS for COS close when saved, so needs to be reopened for the next tests tests
      if (type === COMPLAINT_TYPES.ERS) {
        await setStatusOpen(page);
      }
    });

    test(`Can edit an external reference number: ${type}`, async ({ page }) => {
      //navigatetoComplaint
      await navigateToComplaint(page, type);
      await waitForSpinner(page);

      //press Edit
      await page.locator("#external-file-reference-edit-button").click();

      //enter the number
      await enterReferenceNumber(page, "222222", true);

      //validate the number
      await expect(page.locator("#external-file-reference-number")).toHaveText("222222");

      // ERS for COS close when saved, so needs to be reopened for the next tests tests
      if (type === COMPLAINT_TYPES.ERS) {
        await setStatusOpen(page);
      }
    });

    test(`Can delete an external reference number: ${type}`, async ({ page }) => {
      //navigatetoComplaint
      await navigateToComplaint(page, type);
      await waitForSpinner(page);

      //press Delete
      await deleteReferenceNumber(page);

      //validate the toast
      const $toast = page.locator(".Toastify__toast-body");
      await expect($toast).toHaveText("Updates have been saved");

      //validate that the empty input is showing
      await validateFormIsEmpty(page);
    });

    //Secondary tests - only need to try these on one complaint type
    test(`Can cancel pending changes to a reference file number (new): ${type}`, async ({ page }) => {
      //navigatetoComplaint
      await navigateToComplaint(page, type);
      await waitForSpinner(page);

      //attempt to delete if there is old data
      await deleteReferenceNumber(page);

      //enter the number
      await enterReferenceNumber(page, "333333", false);
      const $externalref = page.locator("#external-file-reference");
      await $externalref.locator("#external-file-reference-cancel-button").click();
      await page.locator(".modal-footer > .btn-primary").click();

      //validate that the empty input is showing
      await validateFormIsEmpty(page);
    });

    test("Will accept a alphanumeric reference file number with dashes", async ({ page }) => {
      //navigatetoComplaint
      await navigateToComplaint(page, type);

      //make sure that there isn't an old one there from a failed run
      await deleteReferenceNumber(page);

      //enter the number
      await enterReferenceNumber(page, "ABC-123-DEF", true);

      //validate the number
      await expect(page.locator("#external-file-reference-number")).toHaveText("ABC-123-DEF");

      // ERS for COS close when saved, so needs to be reopened for the next tests tests
      await setStatusOpen(page);
    });

    test("Will not accept a reference file number with other special characters", async ({ page }) => {
      //navigatetoComplaint
      await navigateToComplaint(page, type);

      //make sure that there isn't an old one there from a failed run
      await deleteReferenceNumber(page);

      //enter the number
      await enterReferenceNumber(page, "444@BAD#NUMBER$44", false);

      //click save to trigger validation
      await page.locator("#external-file-reference-save-button").click();

      //validate the error message appears
      await hasErrorMessage(page, ["#external-file-reference-number-div"]);
    });
  });
});
