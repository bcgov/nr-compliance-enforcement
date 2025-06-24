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

export async function optionallyWaitForSpinner(page: Page, alternativeSelector: string) {
  const foundSpinner = await Promise.race([
    page
      .locator(".comp-loader-overlay")
      .waitFor()
      .then(() => true),
    page
      .locator(alternativeSelector)
      .waitFor()
      .then(() => false),
  ]).catch(() => {
    throw new Error(`When searching for ${alternativeSelector} and loader overaly, neither were found`);
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
    await expect(page.locator("#comp-zone-filter")).toBeVisible();
    await page.locator("#comp-zone-filter").click(); //clear zone filter so this complaint is in the list view
    await expect(page.locator("#comp-zone-filter")).not.toBeVisible();
    await waitForSpinner(page);
    await expect(page.locator("#comp-status-filter")).toBeVisible();
    await page.locator("#comp-status-filter").click(); //clear status filter so this complaint is in the list view
    await waitForSpinner(page);
    await expect(page.locator("#comp-status-filter")).not.toBeVisible();

    //-- check to make sure there are items in the table
    await expect(await page.locator("#complaint-list").locator("tr").count()).toBeGreaterThan(0);
    await page.locator("#complaint-list > tbody > tr").getByText(complaintIdentifier).first().click();
  }
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

export async function typeAndTriggerChange(locatorValue, value, page: Page) {
  const element = await page.locator(locatorValue)[0];

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

  nativeInputValueSetter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

export async function selectItemById(selectId: string, optionText: string, page: Page) {
  await page.locator(`#${selectId}`).click();
  await expect(page.locator(".comp-select__menu-list")).toBeVisible(); //Wait for the options to show
  await page.locator(`.comp-select__option`, { hasText: optionText }).first().click();
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
    await page.locator(".react-datepicker-time__input").locator("input:scope").click();
    await page.locator(".react-datepicker-time__input").locator("input:scope").fill(`${hour}:${minute}`);
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
  await page.locator(saveButtonId).click();
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
    await expect(async () => {
      const $div = page.locator("#action-required-div", { hasText: actionRequired }).first();
      expect($div).toHaveText(actionRequired);
    }).toPass();

    if (actionRequired === "Yes") {
      //Verify Fields exist
      for (let checkbox of checkboxes) {
        await expect(async () => {
          const $div = page.locator(checkboxDiv);
          expect($div).toHaveText(checkbox);
        }).toPass();
      }
    }
  } else if (checkboxes) {
    for (let checkbox of checkboxes) {
      await expect(async () => {
        const $div = page.locator(checkboxDiv);
        expect($div).toHaveText(checkbox);
      }).toPass();
    }
  }

  if (justification) {
    await expect(async () => {
      const $div = page.locator("#justification-div");
      expect($div).toHaveText(justification);
    }).toPass();
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
    const $div = page.locator(dateDiv);
    expect($div).toHaveText(date); //Don't know the month... could maybe make this a bit smarter but this is probably good enough.
  }).toPass();

  //validate the toast
  if (toastText) {
    const $toast = page.locator(".Toastify__toast-body");
    expect($toast).toHaveText(toastText);
  }
}

export async function navigateToCreateScreen(page: Page) {
  await page.goto("/");
  await waitForSpinner(page);
  await page.locator("#create-complaints-link").click();
}
