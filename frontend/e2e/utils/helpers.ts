import { expect, Locator, Page } from "@playwright/test";

export const slowExpect = expect.configure({ timeout: 60000 }); // 1 Minute for the spinner.

export async function waitForSpinner(page: Page, timeBeforeContinuing: number = 6000) {
  // make sure the page is totally loaded first
  await page.locator(".comp-app-container").waitFor();

  const spinner = page.locator(".comp-loader-overlay");

  // Check if spinner becomes visible within timeout
  const appeared = await spinner.isVisible({ timeout: timeBeforeContinuing }).catch(() => false);

  if (appeared) {
    // Now wait for it to disappear — this will automatically retry
    await slowExpect(spinner).not.toBeVisible();
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
  for (const input of inputs) {
    const errorLocator = page.locator(input).locator(".error-message");
    await expect(errorLocator).toContainText(/.+/); // look for any error - we don't care what it is
  }

  //validate the toast
  if (toastText) {
    const toasts = await page.locator(".Toastify__toast-body").allTextContents();
    const found = toasts.some((text) => text.includes(toastText));
    expect(found).toBe(true);
  }
}

export async function typeAndTriggerChange(locatorValue: string, value: string, page: Page) {
  const foundItems = await page.locator(locatorValue).count();
  if (foundItems) {
    await page.locator(locatorValue).fill(value);
  }
}

export async function selectItemById(selectId: string, optionText: string, page: Page) {
  const input = page.locator(`#${selectId}`).first();
  await expect(input).toBeVisible();
  await input.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await input.click({ force: true });
  await page.waitForSelector('[class*="__option"]', { state: "visible", timeout: 5000 });
  await page.keyboard.type(optionText);
  await page.keyboard.press("Enter");
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
    const icon = page.locator(".leaflet-marker-icon svg").first();
    await expect(icon).toBeVisible();
  } else {
    expect(page.locator(".leaflet-marker-icon")).not.toBeVisible();
  }
}

/**
 * Wait for Leaflet map to be fully loaded and rendered
 */
export async function waitForMapToLoad(page: Page, timeout: number = 10000) {
  const leafletContainer = page.locator(".leaflet-container");
  await expect(leafletContainer).toBeVisible({ timeout });

  // Wait for the map pane to be attached
  await leafletContainer.locator(".leaflet-map-pane").waitFor({ state: "attached", timeout });

  // Wait for tiles or markers to indicate the map has rendered content
  // Use "attached" instead of "visible" because Leaflet markers with leaflet-zoom-animated
  // class may be reported as hidden during animations due to CSS transforms/opacity
  const tilesOrMarkers = leafletContainer.locator(".leaflet-tile-loaded, .leaflet-marker-icon");
  await tilesOrMarkers.first().waitFor({ state: "attached", timeout });

  // Small delay for any remaining rendering. Sadly required.
  await page.waitForTimeout(500);
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
  await saveButton.click();
}

export async function validateHWCSection(loc: Locator, page: Page, sectionParams: Partial<HWCSectionParams>) {
  //use the locator if provided
  const testSection = loc ?? page;

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
    await expect(await testSection.locator("#action-required-div", { hasText: actionRequired }).first()).toBeVisible();

    if (actionRequired === "Yes") {
      //Verify Fields exist
      for (let checkbox of checkboxes) {
        await expect(await testSection.locator(checkboxDiv, { hasText: checkbox }).first()).toBeVisible();
      }
    }
  } else if (checkboxes) {
    for (let checkbox of checkboxes) {
      await expect(await testSection.locator(checkboxDiv, { hasText: checkbox }).first()).toBeVisible;
    }
  }

  if (justification) {
    await expect(await testSection.locator("#justification-div", { hasText: justification }).first()).toBeVisible;
  }

  if (equipmentType) {
    await expect(async () => {
      const $div = testSection.locator("#equipment-type-title");
      expect($div).toHaveText(equipmentType);
    }).toPass();
  }
  await expect(async () => {
    const $div = testSection.locator(officerDiv);
    expect($div).toContainText(officer);
  }).toPass();
  await expect(async () => {
    const dateText = await testSection.locator(dateDiv).textContent();
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

    // playwright can't verify things that happen in other tabs, so don't open attachments in another tab
    await expect(scope.locator(".comp-slide-download-btn").first()).toBeVisible();
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
  await typeaheadInput.pressSequentially(optionText);
  await expect(await page.locator(".dropdown-item").getByText(optionText).first()).toBeVisible();
  await page.locator(".dropdown-item").getByText(optionText).first().click();
}

export async function isHeaderinViewPort(page: Page) {
  // Assuming 'subject' is a Playwright element handle
  const elementHandle = page.locator(".comp-details-header");

  const rect = await elementHandle.boundingBox();
  const viewportHeight = await page.evaluate(() => window.innerHeight);

  // Assertions:
  if (rect?.top >= viewportHeight) {
    throw new Error(`Expected element not to be below the visible scrolled area`);
  }

  if (rect?.top < 0) {
    throw new Error(`Expected element not to be above the visible scrolled area`);
  }

  return elementHandle;
}

export async function validateComplaint(page: Page, expectedComplaintId: string, expectedSpecies: string) {
  await expect(await page.locator(".comp-box-complaint-id")).toContainText(expectedComplaintId);
  await expect(await page.locator(".comp-box-species-type")).toContainText(expectedSpecies);
}
