import { expect, Locator, Page } from "@playwright/test";

export const slowExpect = expect.configure({ timeout: 30000 });

export async function waitForSpinner(page: Page, timeBeforeContinuing: number = 6000) {
  const foundSpinner = await Promise.race([
    page
      .locator(".comp-loader-overlay")
      .waitFor()
      .then(() => true),
    page.waitForTimeout(timeBeforeContinuing).then(() => false),
  ]).catch((error) => {
    throw new Error(`An error occurred while executing timedWaitForSpinner`, error);
  });
  if (foundSpinner) {
    await slowExpect(page.locator(".comp-loader-overlay")).not.toBeVisible();
  }
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

    //-- click on HWCR tab
    await page.locator(`#${complaintType.toLowerCase()}-tab`).click();
    await expect(await page.locator("#comp-zone-filter")).toBeVisible();
    await page.locator("#comp-zone-filter").click(); //clear zone filter so this complaint is in the list view
    await expect(await page.locator("#comp-zone-filter")).not.toBeVisible();
    await waitForSpinner(page);
    await expect(await page.locator("#comp-status-filter")).toBeVisible();
    await page.locator("#comp-status-filter").click(); //clear status filter so this complaint is in the list view
    await waitForSpinner(page);
    await expect(await page.locator("#comp-status-filter")).not.toBeVisible();

    //-- check to make sure there are items in the table
    await expect(await page.locator("#complaint-list").locator("tr").count()).toBeGreaterThan(0);
    await page.locator("#complaint-list > tbody > tr").getByText(complaintIdentifier).first().click();
  }
  await waitForSpinner(page);
}

export async function navigateToEditScreen(
  complaintType: string,
  complaintIdentifier: string,
  navigateByUrl: boolean,
  page: Page,
) {
  await navigateToDetailsScreen(complaintType.toLowerCase(), complaintIdentifier, navigateByUrl, page);
  await page.locator("#details-screen-edit-button").click();
}

export async function navigateToTab(complaintTab: string, removeFilters: boolean, page: Page) {
  //-- load the human wildlife conflicts
  await page.locator(complaintTab).click();

  //-- verify correct tab
  if (complaintTab === "#hwcr-tab") {
    await expect(await page.locator(complaintTab)).toHaveText(/Human Wildlife Conflict/);
  } else {
    await expect(await page.locator(complaintTab)).toHaveText(/Enforcement/);
  }

  if (removeFilters) {
    await page.locator("#comp-status-filter").click();
    await page.locator("#comp-zone-filter").click();
    await expect(await page.locator("#comp-status-filter")).not.toBeVisible();
    await expect(await page.locator("#comp-zone-filter")).not.toBeVisible();
  }
}

export async function assignSelfToComplaint(page: Page) {
  await page.locator("#details-screen-assign-button").click();
  await page.locator("#self_assign_button").click();
  await waitForSpinner(page);
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

export async function typeAndTriggerChange(locatorValue, value, page: Page) {
  const foundItems = await page.locator(locatorValue).count();
  if (foundItems) {
    await page.locator(locatorValue).fill(value);
  }
}

export async function selectItemById(selectId: string, optionText: string, page: Page) {
  await page.locator(`#${selectId}`).first().click();
  await expect(page.locator(".comp-select__menu-list")).toBeVisible(); //Wait for the options to show
  await page.locator(`.comp-select__option`, { hasText: optionText }).first().click({ force: true });
}

export async function enterDateTimeInDatePicker(
  page: Page,
  datePickerId: string,
  day: string,
  hour?: string,
  minute?: string,
) {
  await page.locator(`#${datePickerId}`).click();
  const dateButtons = await page.locator(`.react-datepicker__day--0${day}`).all();
  await dateButtons[0].click();

  // Locate the time input field and click it to open the time picker
  if (hour && minute) {
    await page.locator(`#${datePickerId}`).click();
    await page.locator(".react-datepicker-time__input").locator("input:scope").fill(`${hour}:${minute}`);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
  }
}
export async function verifyMapMarkerExists(existIndicator: boolean, page: Page) {
  await expect(page.locator(".leaflet-container")).toBeVisible();
  if (existIndicator) {
    const icon = await page.locator(".leaflet-marker-icon");
    expect(icon).toBeVisible();
  } else {
    expect(page.locator(".leaflet-marker-icon")).not.toBeVisible();
  }
}

interface HWCSectionParams {
  section;
  checkboxes?;
  officer?;
  date?;
  actionRequired?;
  toastText?;
  justification?;
  equipmentType?;
}

export async function fillInHWCSection(loc: Locator, page: Page, sectionParams: Partial<HWCSectionParams>) {
  let officerId = "prev-educ-outcome-officer";
  let datePickerId = "prev-educ-outcome-date";
  let saveButtonId = "#outcome-save-prev-and-educ-button";
  const { section, actionRequired, checkboxes, justification, equipmentType, officer, date } = sectionParams;

  if (section === "ASSESSMENT") {
    officerId = "outcome-officer";
    datePickerId = "complaint-outcome-date";
    saveButtonId = "#outcome-save-button";
  } else if (section === "EQUIPMENT") {
    officerId = "equipment-officer-set-select";
    datePickerId = "equipment-day-set";
    saveButtonId = "#equipment-save-button";
  }

  if (section === "ASSESSMENT" && actionRequired) {
    await selectItemById("action-required", actionRequired, page);
    if (actionRequired === "Yes") {
      for (let checkbox of checkboxes) {
        await loc.locator(checkbox).check();
      }
    }
  } else if (checkboxes) {
    for (let checkbox of checkboxes) {
      await loc.locator(checkbox).check();
    }
  }

  if (justification) {
    await selectItemById("justification", justification, page);
  }

  if (equipmentType) {
    await selectItemById("equipment-type-select", equipmentType, page);
  }
  await selectItemById(officerId, officer, page);
  await enterDateTimeInDatePicker(page, datePickerId, date);

  //click Save Button
  const saveButton = await page.locator(saveButtonId).first();
  saveButton.click();
}

export async function validateHWCSection(loc: Locator, page: Page, sectionParams: Partial<HWCSectionParams>) {
  const { section, actionRequired, checkboxes, justification, equipmentType, officer, date, toastText } = sectionParams;
  let checkboxDiv = "#prev-educ-checkbox-div";
  let officerDiv = "#prev-educ-outcome-officer-div";
  let dateDiv = "#prev-educ-outcome-date-div";

  if (section === "ASSESSMENT") {
    checkboxDiv = "#assessment-checkbox-div";
    officerDiv = "#assessment-officer-div";
    dateDiv = "#assessment-date-div";
  } else if (section === "EQUIPMENT") {
    officerDiv = "#equipment-officer-set-div";
    dateDiv = "#equipment-date-set-div";
  }

  if (section === "ASSESSMENT" && actionRequired) {
    await expect(await page.locator("#action-required-div", { hasText: actionRequired }).first()).toBeVisible();

    if (actionRequired === "Yes") {
      //Verify Fields exist
      for (let checkbox of checkboxes) {
        await expect(await page.locator(checkboxDiv, { hasText: checkbox }).first()).toBeVisible();
      }
    }
  } else if (checkboxes) {
    for (let checkbox of checkboxes) {
      await expect(await page.locator(checkboxDiv, { hasText: checkbox }).first()).toBeVisible;
    }
  }

  if (justification) {
    await expect(await page.locator("#justification-div", { hasText: justification }).first()).toBeVisible;
  }

  if (equipmentType) {
    await expect(async () => {
      const $div = page.locator("#equipment-type-title");
      expect($div).toHaveText(equipmentType);
    }).toPass();
  }
  await expect(async () => {
    const $div = page.locator(officerDiv);
    expect($div).toHaveText(officer);
  }).toPass();
  await expect(async () => {
    const dateText = await page.locator(dateDiv).textContent();
    expect(dateText).toContain(date); //Don't know the month... could maybe make this a bit smarter but this is probably good enough.
  }).toPass();

  //validate the toast
  if (toastText) {
    await expect(await page.locator(".Toastify__toast-body", { hasText: toastText })).toBeVisible();
  }
}

export async function navigateToCreateScreen(page: Page) {
  await page.goto("/complaint/createComplaint");
  await waitForSpinner(page);
}

export async function verifyAttachmentsCarousel(page: Page, uploadable: boolean, divId: string) {
  const scope = await page.locator(`#${divId}`);
  // verify the attachments section exists
  await expect(scope.getByText(/attachments/).first()).toBeVisible();

  // verify the carousel exists (since 23-000076, 23-006888 are known to have attachments)
  await expect(scope.locator("div.comp-carousel")).toBeVisible();

  if (!uploadable) {
    await expect(scope.locator(".comp-attachment-upload-btn")).not.toBeVisible();
    // scope.locator(".comp-attachment-slide-actions").first().("attr", "style", "display: block");

    // cypress can't verify things that happen in other tabs, so don't open attachments in another tab
    await expect(scope.locator(".comp-slide-download-btn")).toBeVisible();
  }
}

export async function clearFilterById(filterId: string, page: Page) {
  await expect(page.locator(`#${filterId}`)).toBeVisible();
  await page.locator(`#${filterId}`).click(); //clear status filter in list view
  await expect(page.locator(`#${filterId}`)).not.toBeVisible();
}

export async function selectTypeAheadItemByText(selectId: string, optionText: string, page: Page) {
  const typeaheadInput = page.locator(`#${selectId}`).locator("input").first();
  await typeaheadInput.clear();
  await typeaheadInput.fill(optionText);
  await expect(await page.locator(".dropdown-item").getByText(optionText).first()).toBeVisible();
  await page.locator(".dropdown-item").getByText(optionText).first().click();
}
