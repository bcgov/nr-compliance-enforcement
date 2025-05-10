import { RootState } from "@store/store";
import Option from "@apptypes/app/option";
import { ScheduleSectorXref } from "@apptypes/app/code-tables/schedule-sector-xref";
import { createSelector } from "@reduxjs/toolkit";
const selectCodeTables = (state: RootState) => state.codeTables;

export const selectDischargeDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { discharge: items } = codeTables;
  return items.map(({ discharge: value, longDescription: label }) => ({ label, value }));
});

export const selectNonComplianceDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "non-compliance": items } = codeTables;
  return items.map(({ nonCompliance: value, longDescription: label }) => ({ label, value }));
});

export const selectSectorDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { sector: items } = codeTables;
  return items.map(({ sector: value, longDescription: label }) => ({ label, value }));
});

export const selectScheduleSectorXref = createSelector(
  [selectCodeTables],
  (codeTables) => codeTables["schedule-sector-type"],
);

export const selectScheduleDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { schedule: items } = codeTables;
  return items.map(({ schedule: value, longDescription: label }) => ({ label, value }));
});

export const selectIPMAuthCategoryDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "ipm-auth-category": items } = codeTables;
  return items
    .filter((item) => item.isActive === true)
    .map(({ ipmAuthCategoryCode: value, longDescription: label }) => ({ label, value }));
});

export const selectDecisionTypeDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "decision-type": items } = codeTables;
  return items.map(({ decisionType: value, longDescription: label }) => ({ label, value }));
});

export const selectEquipmentStatusDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "equipment-status": items } = codeTables;
  return items.map(({ equipmentStatus: value, longDescription: label }) => ({ label, value }));
});

export const selectParkAreasDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "park-area": items } = codeTables;
  return items.map(({ parkAreaGuid: value, name: label }) => ({ label, value }));
});
