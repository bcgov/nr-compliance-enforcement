import { RootState } from "@store/store";
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

export const selectPartyTypeDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "party-type": items } = codeTables;
  return items.map(({ partyTypeCode: value, shortDescription: label, isActive, displayOrder }) => ({
    label,
    value,
    isActive,
    displayOrder,
  }));
});

export const selectPartyAssociationRoleDropdown = createSelector([selectCodeTables], (codeTables) => {
  const { "party-association-role": items } = codeTables;
  return items.map(
    ({
      partyAssociationRole: value,
      caseActivityTypeCode,
      shortDescription: label,
      activeIndicator,
      displayOrder,
    }) => ({
      label,
      value,
      activeIndicator,
      displayOrder,
      caseActivityTypeCode,
    }),
  );
});

export const selectTaskCategory = createSelector([selectCodeTables], (codeTables) => {
  const { "task-category-type": items } = codeTables;
  return items.map(({ taskCategoryTypeCode: value, longDescription: label }) => ({ label, value }));
});

export const selectTaskSubCategory = createSelector([selectCodeTables], (codeTables) => {
  const { "task-type": items } = codeTables;
  return items.map(({ taskTypeCode: value, taskCategoryTypeCode: taskCategory, longDescription: label }) => ({
    label,
    taskCategory,
    value,
  }));
});

export const selectTaskStatus = createSelector([selectCodeTables], (codeTables) => {
  const { "task-status-type": items } = codeTables;
  return items.map(({ taskStatusCode: value, longDescription: label }) => ({ label, value }));
});

export const selectLegislationTypes = createSelector([selectCodeTables], (codeTables) => {
  const { "legislation-type": items } = codeTables;
  return items;
});

export const selectLegislationTypeLabels = createSelector([selectCodeTables], (codeTables) => {
  const { "legislation-type": items } = codeTables;
  return items.reduce(
    (acc, item) => {
      acc[item.legislationTypeCode] = item.shortDescription;
      return acc;
    },
    {} as Record<string, string>,
  );
});
