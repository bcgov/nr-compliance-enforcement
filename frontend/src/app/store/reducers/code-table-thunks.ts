import { from } from "linq-to-typescript";
import config from "@/config";
import { generateApiParameters, get } from "@common/api";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { Discharge } from "@apptypes/app/code-tables/discharge";
import { NonCompliance } from "@apptypes/app/code-tables/non-compliance";
import { Schedule } from "@apptypes/app/code-tables/schedule";
import { Sector } from "@apptypes/app/code-tables/sector";
import { AppThunk } from "@store/store";
import { setCodeTable } from "./code-table";
import { DecisionType } from "@apptypes/app/code-tables/decision-type";
import { ScheduleSectorXref } from "@apptypes/app/code-tables/schedule-sector-xref";
import { EquipmentStatus } from "@apptypes/app/code-tables/equipment-status";
import { ParkArea } from "@/app/types/app/code-tables/park-area";
import { EmailReference } from "@/app/types/app/code-tables/email-reference";
import { PartyType } from "@/app/types/app/shared/party-type";
import { PartyAssociationRole } from "@/app/types/app/shared/party-association-role";
import { TaskStatusType } from "@/app/types/app/investigation/task-status";
import { TaskCategoryType } from "@/app/types/app/investigation/task-category";
import { TaskType } from "@/app/types/app/investigation/task-category-detail";

export const fetchDischargeTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.DISCHARGE}`);

  const response = await get<Array<Discharge>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.DISCHARGE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchNonComplianceTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.NON_COMPLIANCE}`);

  const response = await get<Array<NonCompliance>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.NON_COMPLIANCE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchSectorTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.SECTOR}`);

  const response = await get<Array<Sector>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.SECTOR, data: response };
    dispatch(setCodeTable(payload));
  }
};
export const fetchScheduleSectorTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(
    `${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.SCHEDULE_SECTOR_TYPE}`,
  );

  const response = await get<Array<ScheduleSectorXref>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.SCHEDULE_SECTOR_TYPE, data: response };
    dispatch(setCodeTable(payload));
  }
};
export const fetchScheduleTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.SCHEDULE}`);

  const response = await get<Array<Schedule>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.SCHEDULE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchCEEBDecisionTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.DECISION_TYPE}`);

  const response = await get<Array<DecisionType>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.DECISION_TYPE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchEquipmentStatus = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.EQUIPMENT_STATUS}`);

  const response = await get<Array<EquipmentStatus>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.EQUIPMENT_STATUS, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchParkAreas = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.PARK_AREA}`);

  const response = await get<Array<ParkArea>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.PARK_AREA, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchEmailReference = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.EMAIL_REFERENCE}`);

  const response = await get<Array<EmailReference>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.EMAIL_REFERENCE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchPartyTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.PARTY_TYPE}`);

  const response = await get<Array<PartyType>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.PARTY_TYPE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchPartyAssociationRoles = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(
    `${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE}`,
  );
  const response = await get<Array<PartyAssociationRole>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchTaskStatusTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.TASK_STATUS_TYPE}`);
  const response = await get<Array<TaskStatusType>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.TASK_STATUS_TYPE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchTaskCategoryTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(
    `${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.TASK_CATEGORY_TYPE}`,
  );
  const response = await get<Array<TaskCategoryType>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.TASK_CATEGORY_TYPE, data: response };
    dispatch(setCodeTable(payload));
  }
};

export const fetchTaskTypes = (): AppThunk => async (dispatch) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/code-table/${CODE_TABLE_TYPES.TASK_TYPE}`);
  const response = await get<Array<TaskType>>(dispatch, parameters);
  if (response && from(response).any()) {
    const payload = { key: CODE_TABLE_TYPES.TASK_TYPE, data: response };
    dispatch(setCodeTable(payload));
  }
};
