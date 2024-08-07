import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("HWCR Outcome Equipment", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032456", true);
  });

  function deleteAllEquipments() {
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($equipment) {
      const isVisible = $equipment.find("#equipment-delete-button").is(":visible");
      if (isVisible) {
        cy.get("#equipment-delete-button").click();
        cy.get(".modal-footer > .btn-primary").click();
        deleteAllEquipments();
      }
    });
  }

  it("it requires valid user input", () => {
    cy.get(".comp-outcome-report-button").then(function ($equipment) {
      if ($equipment.find("#outcome-report-add-equipment").length > 0) {
        deleteAllEquipments();
        cy.get("#outcome-report-add-equipment").click();
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($equipment) {
      if ($equipment.find("#equipment-save-button").length) {
        cy.validateComplaint("23-032456", "Racoon");

        //click Save Button
        cy.get("#equipment-save-button").click();

        //validate Equipment type is required
        cy.get("#equipment-type-div").find(".error-message").should("exist");

        //validate Address is required
        cy.get("#equipment-address-container").find(".equipment-form-error-msg").should("exist");

        //validate XY coordinates is required
        cy.get("#equipment-x-coordinate-container").find(".equipment-form-error-msg").should("exist");
        cy.get("#equipment-y-coordinate-container").find(".equipment-form-error-msg").should("exist");

        //validate the Set-by is required
        cy.get("#equipment-officer-set-div").find(".error-message").should("exist");

        // //validate the toast
        cy.get(".Toastify__toast-body").then(($toast) => {
          expect($toast).to.contain.text("Errors creating equipment");
        });
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });
  });

  it("it can save equipment", () => {
    cy.get(".comp-outcome-report-button").then(function ($equipment) {
      if ($equipment.find("#outcome-report-add-equipment").length > 0) {
        cy.get("#outcome-report-add-equipment").click();
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });

    cy.get(".comp-outcome-report-complaint-assessment").then(function ($equipment) {
      if ($equipment.find("#equipment-save-button").length) {
        let sectionParams = {
          section: "EQUIPMENT",
          officer: "Benson, Olivia",
          date: "01",
          toastText: "Equipment has been updated",
          equipmentType: "Bear snare",
        };
        cy.get("#equipment-copy-address-button").click();
        cy.get("#equipment-copy-coordinates-button").click();

        cy.fillInHWCSection(sectionParams).then(() => {
          cy.validateHWCSection(sectionParams);
        });
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });
  });

  it("it can edit an existing equipment", () => {
    cy.validateComplaint("23-032456", "Racoon");

    cy.get(".comp-outcome-report-complaint-assessment").then(function ($equipment) {
      if ($equipment.find("#equipment-edit-button").length) {
        cy.get("#equipment-edit-button").click();

        let sectionParams = {
          section: "EQUIPMENT",
          officer: "Nancy Drew",
          date: "02",
          toastText: "Equipment has been updated",
          equipmentType: "Bear live trap",
        };

        cy.fillInHWCSection(sectionParams).then(() => {
          cy.validateHWCSection(sectionParams);
        });
      } else {
        cy.log("Equipment Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });

  it("it can delete an existing equipment", () => {
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($equipment) {
      if ($equipment.find("#equipment-delete-button").length) {
        cy.get("#equipment-delete-button").click();
        cy.get(".modal-footer > .btn-primary").click();

        //validate the toast
        cy.get(".Toastify__toast-body").then(($toast) => {
          expect($toast).to.contain.text("Equipment has been deleted");
        });

        cy.get("#outcome-report-add-equipment").should("exist");
      } else {
        cy.log("Equipment delete button not found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });
});
