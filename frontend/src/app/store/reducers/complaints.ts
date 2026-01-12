import { Action, Dispatch, PayloadAction, ThunkAction, createSlice, createSelector, current } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@store/store";
import config from "@/config";
import { ComplaintCollection, ComplaintState } from "@apptypes/state/complaint-state";
import { ComplaintHeader } from "@apptypes/complaints/details/complaint-header";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { ComplaintDetails } from "@apptypes/complaints/details/complaint-details";
import { ComplaintDetailsAttractant } from "@apptypes/complaints/details/complaint-attactant";
import { ComplaintCallerInformation } from "@apptypes/complaints/details/complaint-caller-information";
import { ComplaintSuspectWitness } from "@apptypes/complaints/details/complaint-suspect-witness-details";
import ComplaintType from "@constants/complaint-types";
import { ZoneAtAGlanceStats } from "@apptypes/complaints/zone-at-a-glance-stats";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters";
import { ComplaintRequestPayload } from "@apptypes/complaints/complaint-filters/complaint-request-payload";
import { generateApiParameters, get, patch, post } from "@common/api";
import { Feature } from "@apptypes/maps/bcGeocoderType";
import { ToggleSuccess, ToggleError } from "@common/toast";
import { Coordinates } from "@apptypes/app/coordinate-type";

import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint } from "@apptypes/app/complaints/allegation-complaint";
import { Complaint } from "@apptypes/app/complaints/complaint";

import { AttractantXref as AttractantXrefDto } from "@apptypes/app/complaints/attractant-xref";
import { Attractant as AttractantDto } from "@apptypes/app/code-tables/attactant";

import { from } from "linq-to-typescript";
import {
  getNatureOfComplaintByNatureOfComplaintCode,
  getSpeciesBySpeciesCode,
  getStatusByStatusCode,
  getViolationByViolationCode,
  getGirTypeByGirTypeCode,
  getIssueDescription,
} from "@common/methods";
import { Agency } from "@apptypes/app/code-tables/agency";
import { ReportedBy } from "@apptypes/app/code-tables/reported-by";
import { WebEOCComplaintUpdateDTO } from "@apptypes/app/complaints/webeoc-complaint-update";
import { RelatedData } from "@apptypes/app/complaints/related-data";
import { ActionTaken } from "@apptypes/app/complaints/action-taken";

import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { ComplaintMethodReceivedType } from "@apptypes/app/code-tables/complaint-method-received-type";
import { LinkedComplaint } from "@/app/types/app/complaints/linked-complaint";
import { getUserAgency } from "@/app/service/user-service";
import { Collaborator } from "@apptypes/app/complaints/collaborator";
import { generateExportComplaintInputParams } from "@/app/store/reducers/documents-thunks";
import { CodeTableState } from "@/app/types/state/code-table-state";
import { SectorComplaint } from "@/app/types/app/complaints/sector-complaint";
import { getAttachments } from "@/app/store/reducers/attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";

type ComplaintDtoAlias = WildlifeComplaint | AllegationComplaint | GeneralIncidentComplaint | Complaint;

const initialState: ComplaintState = {
  complaintSearchParameters: {
    sortColumn: "",
    sortOrder: "",
  },
  complaintItems: {
    wildlife: [],
    allegations: [],
    general: [],
    sector: [],
  },
  totalCount: 0,
  complaint: null,
  complaintLocation: null,
  complaintCollaborators: [],

  zoneAtGlance: {
    hwcr: { assigned: 0, unassigned: 0, total: 0, offices: [] },
    allegation: { assigned: 0, unassigned: 0, total: 0, offices: [] },
  },

  mappedComplaintsCount: { mapped: 0, unmapped: 0 },

  webeocUpdates: [],
  actions: [],
  referrals: [],

  webeocChangeCount: 0,
  linkedComplaints: [],
  complaintView: {
    isReadOnly: false,
  },
  caseFileComplaints: [],
};
export const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetComplaintSearchParameters: (state) => {
      return { ...state, complaintSearchParameters: initialState.complaintSearchParameters };
    },
    setComplaintSearchParameters: (state, action) => {
      return { ...state, complaintSearchParameters: action.payload };
    },
    setComplaints: (state, action) => {
      const {
        payload: { type, data },
      } = action;
      const { complaintItems } = state;

      let update: ComplaintCollection;
      switch (type) {
        case COMPLAINT_TYPES.ERS:
          update = { ...complaintItems, allegations: data };
          break;
        case COMPLAINT_TYPES.HWCR:
          update = { ...complaintItems, wildlife: data };
          break;
        case COMPLAINT_TYPES.GIR:
          update = { ...complaintItems, general: data };
          break;
        case COMPLAINT_TYPES.SECTOR:
          update = { ...complaintItems, sector: data };
          break;
        default:
          console.error(`Unknown complaint type: ${type}`);
          return state; // No change if the type is unknown
      }
      return { ...state, complaintItems: update };
    },
    setTotalCount(state, action) {
      state.totalCount = action.payload;
    },

    setComplaint: (state, action) => {
      const { payload: complaint } = action;
      let currentComplaint: Complaint = complaint as Complaint;
      let isReadOnly = false;
      if (currentComplaint) {
        if (["CLOSED"].includes(currentComplaint.status)) {
          isReadOnly = true;
        }
        //if complaint has open status, check if complaint is within the user's agency
        //if complaint does not belong to the user's agency, enable read-only mode
        else {
          const complaintAgency = complaint.ownedBy;
          const userAgency = getUserAgency();
          if (complaintAgency !== userAgency) {
            isReadOnly = true;
          }
        }
      }
      return { ...state, complaint, complaintView: { isReadOnly } };
    },

    setCaseFileComplaints: (state, action) => {
      const { payload } = action;
      return { ...state, caseFileComplaints: payload };
    },

    clearComplaint: (state) => {
      return { ...state, complaint: null };
    },

    setComplaintCollaborators: (state, action) => {
      return {
        ...state,
        complaintCollaborators: action.payload,
      };
    },

    setGeocodedComplaintCoordinates: (state, action) => {
      const { payload: complaintLocation } = action;
      return { ...state, complaintLocation };
    },
    setZoneAtAGlance: (state, action) => {
      const { payload: statistics } = action;
      const { type, ...rest } = statistics;
      const { zoneAtGlance } = state;

      const update =
        type === ComplaintType.HWCR_COMPLAINT ? { ...zoneAtGlance, hwcr: rest } : { ...zoneAtGlance, allegation: rest };

      return { ...state, zoneAtGlance: update };
    },
    updateWildlifeComplaintByRow: (state, action: PayloadAction<WildlifeComplaint>) => {
      const { payload: updatedComplaint } = action;
      const { complaintItems } = current(state);
      const { wildlife } = complaintItems;

      const index = wildlife.findIndex(({ hwcrId }) => hwcrId === updatedComplaint.hwcrId);

      if (index !== -1) {
        const { status, delegates, updatedOn } = updatedComplaint;

        let complaint = { ...wildlife[index], status, delegates, updatedOn };

        const update = [...wildlife];
        update[index] = complaint;

        const updatedItems = { ...complaintItems, wildlife: update };

        return { ...state, complaintItems: updatedItems };
      }
    },
    updateGeneralComplaintByRow: (state, action: PayloadAction<GeneralIncidentComplaint>) => {
      const { payload: updatedComplaint } = action;
      const { complaintItems } = current(state);
      const { general } = complaintItems;

      const index = general.findIndex(({ girId }) => girId === updatedComplaint.girId);

      if (index !== -1) {
        const { status, delegates, updatedOn } = updatedComplaint;

        let complaint = { ...general[index], status, delegates, updatedOn };

        const update = [...general];
        update[index] = complaint;

        const updatedItems = { ...complaintItems, general: update };

        return { ...state, complaintItems: updatedItems };
      }
    },
    updateAllegationComplaintByRow: (state, action: PayloadAction<AllegationComplaint>) => {
      const { payload: updatedComplaint } = action;
      const { complaintItems } = current(state);
      const { allegations } = complaintItems;

      const index = allegations.findIndex(({ ersId }) => ersId === updatedComplaint.ersId);

      if (index !== -1) {
        const { status, delegates, updatedOn } = updatedComplaint;

        let complaint = { ...allegations[index], status, delegates, updatedOn };

        const update = [...allegations];
        update[index] = complaint;

        const updatedItems = { ...complaintItems, allegations: update };

        return { ...state, complaintItems: updatedItems };
      }
    },
    updateGeneralIncidentComplaintByRow: (state, action: PayloadAction<GeneralIncidentComplaint>) => {
      const { payload: updatedComplaint } = action;
      const { complaintItems } = current(state);
      const { general } = complaintItems;

      const index = general.findIndex(({ girId }) => girId === updatedComplaint.girId);

      if (index !== -1) {
        const { status, delegates, updatedOn } = updatedComplaint;

        let complaint = { ...general[index], status, delegates, updatedOn };

        const update = [...general];
        update[index] = complaint;

        const updatedItems = { ...complaintItems, general: update };

        return { ...state, complaintItems: updatedItems };
      }
    },
    setMappedComplaintsCount: (state, action) => {
      const { mappedComplaintsCount } = current(state);
      const {
        payload: { mapped, unmapped },
      } = action;

      const update = {
        mapped: mapped ?? mappedComplaintsCount.mapped,
        unmapped: unmapped ?? mappedComplaintsCount.unmapped,
      };

      return {
        ...state,
        mappedComplaintsCount: update,
      };
    },
    setWebEOCUpdates: (state, action: PayloadAction<WebEOCComplaintUpdateDTO[]>) => {
      return { ...state, webeocUpdates: action.payload };
    },
    setRelatedData: (state, action) => {
      const {
        payload: { updates: webeocUpdates, actions, referrals, referral_email_logs, agencyTable },
      } = action;
      for (const referral of referrals) {
        //get the full agency information from state
        referral.referred_by_agency = agencyTable?.find(
          (item: Agency) => item.agency === referral.referred_by_agency_code_ref,
        );

        referral.referred_to_agency = agencyTable?.find(
          (item: Agency) => item.agency === referral.referred_to_agency_code_ref,
        );
        referral.referral_email_logs = referral_email_logs.filter(
          (emailLog: any) =>
            emailLog.complaint_referral_guid.complaint_referral_guid === referral.complaint_referral_guid,
        );
      }
      return { ...state, webeocUpdates, actions, referrals };
    },
    setActions: (state, action: PayloadAction<ActionTaken[]>) => {
      state.actions = action.payload;
    },
    setWebEOCChangeCount: (state, action: PayloadAction<number>) => {
      state.webeocChangeCount = action.payload;
    },
    setComplaintStatus: (state, action) => {
      if (state.complaint) {
        let currentComplaint: Complaint = state.complaint as Complaint;
        if (currentComplaint) {
          state.complaintView.isReadOnly = ["CLOSED"].includes(action.payload);
        }

        state.complaint.status = action.payload;
      }
    },
    setLinkedComplaints: (state, action) => {
      return { ...state, linkedComplaints: action.payload };
    },
    setComplaintEmailReferences: (state, action) => {
      return { ...state, emailReferences: action.payload };
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

// export the actions/reducers
export const {
  resetComplaintSearchParameters,
  setComplaintSearchParameters,
  setComplaints,
  setTotalCount,
  setComplaint,
  setCaseFileComplaints,
  setComplaintCollaborators,
  setGeocodedComplaintCoordinates,
  setZoneAtAGlance,
  updateWildlifeComplaintByRow,
  updateGeneralComplaintByRow,
  updateAllegationComplaintByRow,
  updateGeneralIncidentComplaintByRow,
  setMappedComplaintsCount,
  setWebEOCUpdates,
  setRelatedData,
  setActions,
  setWebEOCChangeCount,
  setComplaintStatus,
  clearComplaint,
  setLinkedComplaints,
  setComplaintEmailReferences,
} = complaintSlice.actions;

//-- redux thunks
export const refreshComplaints =
  (complaintType: string): AppThunk =>
  async (dispatch, getState) => {
    const { complaintSearchParameters } = getState().complaints;
    dispatch(getComplaints(complaintType, complaintSearchParameters));
  };
export const getComplaints =
  (complaintType: string, payload: ComplaintRequestPayload): AppThunk =>
  async (dispatch, getState) => {
    const {
      sortColumn,
      sortOrder,
      regionCodeFilter,
      areaCodeFilter,
      parkFilter,
      areaFilter,
      zoneCodeFilter,
      officerFilter,
      agencyFilter,
      complaintTypeFilter,
      natureOfComplaintFilter,
      speciesCodeFilter,
      startDateFilter,
      endDateFilter,
      violationFilter,
      girTypeFilter,
      complaintStatusFilter,
      complaintMethodFilter,
      actionTakenFilter,
      outcomeAnimalFilter,
      outcomeAnimalStartDateFilter,
      outcomeAnimalEndDateFilter,
      outcomeActionedByFilter,
      equipmentStatusFilter,
      equipmentTypesFilter,
      page,
      pageSize,
      showReferrals,
      query,
    } = payload;

    try {
      dispatch(setComplaint(null));
      dispatch(setComplaintSearchParameters(payload));

      let parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/search/${complaintType}`, {
        sortBy: sortColumn,
        orderBy: sortOrder,
        region: regionCodeFilter?.value,
        zone: zoneCodeFilter?.value,
        community: areaCodeFilter?.value,
        park: parkFilter?.value,
        area: areaFilter?.value,
        officerAssigned: officerFilter?.value,
        agency: agencyFilter?.value,
        complaintTypeFilter: complaintTypeFilter?.value,
        natureOfComplaint: natureOfComplaintFilter?.value,
        speciesCode: speciesCodeFilter?.value,
        incidentReportedStart: startDateFilter,
        incidentReportedEnd: endDateFilter,
        violationCode: violationFilter?.value,
        girTypeCode: girTypeFilter?.value,
        status: complaintStatusFilter?.value,
        complaintMethod: complaintMethodFilter?.value,
        actionTaken: actionTakenFilter?.value,
        outcomeAnimal: outcomeAnimalFilter?.value,
        outcomeAnimalStartDate: outcomeAnimalStartDateFilter,
        outcomeAnimalEndDate: outcomeAnimalEndDateFilter,
        outcomeActionedBy: outcomeActionedByFilter?.value,
        equipmentStatus: equipmentStatusFilter?.value,
        equipmentTypes: equipmentTypesFilter?.map((type) => type.value) ?? [],
        page: page,
        pageSize: pageSize,
        showReferrals: showReferrals,
        query: query,
      });

      const result = await get<{ complaints: any[]; totalCount: number }>(dispatch, parameters);
      const { complaints, totalCount } = result;

      dispatch(setComplaints({ type: complaintType, data: complaints }));
      dispatch(setTotalCount(totalCount));
    } catch (error) {
      console.log(`Unable to retrieve ${complaintType} complaints: ${error}`);
    }
  };

export const getZoneAtAGlanceStats =
  (zone: string, type: ComplaintType): AppThunk =>
  async (dispatch) => {
    try {
      let typeName;
      switch (type) {
        case ComplaintType.ALLEGATION_COMPLAINT:
          typeName = "ERS";
          break;
        case ComplaintType.GENERAL_COMPLAINT:
          typeName = "GIR";
          break;
        case ComplaintType.HWCR_COMPLAINT:
        default:
          typeName = "HWCR";
          break;
      }

      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/stats/${typeName}/by-zone/${zone}`);

      const response = await get<ZoneAtAGlanceStats>(dispatch, parameters);

      dispatch(setZoneAtAGlance({ ...response, type }));
    } catch (error) {
      //-- handle the error message
    }
  };

// used by the autocomplete
export const getComplaintLocationByAddress =
  (address: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/bc-geo-coder/address?addressString=${address}`);
      const response = await get<Feature>(dispatch, parameters);
      dispatch(setGeocodedComplaintCoordinates(response));
    } catch (error) {}
  };

// Used to get the complaint location by area and address
export const getGeocodedComplaintCoordinates =
  (area: string, address?: string): AppThunk =>
  async (dispatch) => {
    try {
      let parameters;
      if (address && area) {
        parameters = generateApiParameters(
          `${config.API_BASE_URL}/bc-geo-coder/address?localityName=${area}&addressString=${address}`,
        );
      } else {
        parameters = generateApiParameters(`${config.API_BASE_URL}/bc-geo-coder/address?localityName=${area}`);
      }
      const response = await get<Feature>(dispatch, parameters);
      dispatch(setGeocodedComplaintCoordinates(response));
    } catch (error) {}
  };

export const getWebEOCUpdates =
  (complaintIdentifier: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-updates/${complaintIdentifier}`);
      const response = await get<WebEOCComplaintUpdateDTO[]>(dispatch, parameters);
      dispatch(setWebEOCUpdates(response));
    } catch (error) {
      console.error(`Unable to retrieve WebEOC updates for complaint ${complaintIdentifier}: ${error}`);
    }
  };
export const getRelatedData =
  (complaintIdentifier: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint-updates/related/${complaintIdentifier}`,
      );
      const response = await get<RelatedData>(dispatch, parameters);
      const agencyTable = getState().codeTables.agency;
      dispatch(
        setRelatedData({
          ...response,
          agencyTable, // 👈 add agencyTable to payload
        }),
      );
    } catch (error) {
      console.error(`Unable to retrieve related data for complaint ${complaintIdentifier}: ${error}`);
    }
  };
export const getActions =
  (complaintIdentifier: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint-updates/actions/${complaintIdentifier}`,
      );
      const response = await get<ActionTaken[]>(dispatch, parameters);
      dispatch(setActions(response));
    } catch (error) {
      console.error(`Unable to retrieve related data for complaint ${complaintIdentifier}: ${error}`);
    }
  };

export const getWebEOCChangeCount =
  (complaintIdentifier: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint-updates/count/${complaintIdentifier}`,
      );
      const response = await get<number[]>(dispatch, parameters);
      const webEOCChangeCount =
        response && response.length > 0 && response[0].hasOwnProperty("value") ? (response[0] as any).value : 0;
      dispatch(setWebEOCChangeCount(webEOCChangeCount));
    } catch (error) {
      console.error(`Unable to retrieve WebEOC changes for complaint ${complaintIdentifier}: ${error}`);
    }
  };

const updateComplaintStatus = async (dispatch: Dispatch, id: string, status: string) => {
  const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/update-status-by-id/${id}`, {
    status: `${status}`,
  });

  await patch<Complaint>(dispatch, parameters);
};

export const updateWildlifeComplaintStatus =
  (complaint_identifier: string, newStatus: string): AppThunk =>
  async (dispatch) => {
    try {
      //-- update the status of the complaint
      await updateComplaintStatus(dispatch, complaint_identifier, newStatus);

      //-- get the wildlife conflict and update its status
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/by-complaint-identifier/HWCR/${complaint_identifier}`,
      );

      const response = await get<WildlifeComplaint>(dispatch, parameters);

      dispatch(updateWildlifeComplaintByRow(response));
      const result = response;

      dispatch(setComplaint({ ...result }));
    } catch (error) {
      //-- add error handling
    }
  };

export const updateAllegationComplaintStatus =
  (complaint_identifier: string, newStatus: string): AppThunk =>
  async (dispatch) => {
    try {
      //-- update the status of the complaint
      await updateComplaintStatus(dispatch, complaint_identifier, newStatus);

      //-- get the wildlife conflict and update its status
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/by-complaint-identifier/ERS/${complaint_identifier}`,
      );
      const response = await get<AllegationComplaint>(dispatch, parameters);
      dispatch(updateAllegationComplaintByRow(response));
      const result = response;

      dispatch(setComplaint({ ...result }));
    } catch (error) {
      //-- add error handling
    }
  };
export const updateGeneralIncidentComplaintStatus =
  (complaint_identifier: string, newStatus: string): AppThunk =>
  async (dispatch) => {
    try {
      //-- update the status of the complaint
      await updateComplaintStatus(dispatch, complaint_identifier, newStatus);

      //-- get the wildlife conflict and update its status
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/by-complaint-identifier/GIR/${complaint_identifier}`,
      );
      const response = await get<GeneralIncidentComplaint>(dispatch, parameters);
      dispatch(updateGeneralIncidentComplaintByRow(response));
      const result = response;

      dispatch(setComplaint({ ...result }));
    } catch (error) {
      //-- add error handling
    }
  };

export const updateComplaintById =
  (complaint: ComplaintDtoAlias, complaintType: string): AppThunk =>
  async (dispatch) => {
    try {
      const { id } = complaint;

      const updateParams = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/update-by-id/${complaintType}/${id}`,
        complaint,
      );

      await patch<ComplaintDtoAlias>(dispatch, updateParams);

      ToggleSuccess("Updates have been saved");
    } catch (error) {
      ToggleError("Unable to update complaint");
    }
  };

export const createComplaintReferral =
  (
    complaint_identifier: string,
    referral_date: Date,
    referred_by_agency_code_ref: string,
    referred_to_agency_code_ref: string,
    app_user_guid_ref: string,
    referral_reason: string,
    complaint_type: string,
    date_logged: Date,
    complaint_url: string,
    additionalEmailRecipients: string[] = [],
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      const attachments = await dispatch(getAttachments(complaint_identifier, AttachmentEnum.COMPLAINT_ATTACHMENT));
      console.log("after get");
      console.log(attachments);
      const agencyTable = getState()?.codeTables?.agency as CodeTableState["agency"] | undefined;
      const agency = agencyTable?.find((item) => item.agency === referred_to_agency_code_ref);
      const externalAgencyInd = agency?.externalAgencyInd;

      const documentExportParams = generateExportComplaintInputParams(
        complaint_identifier,
        attachments,
        complaint_type,
        date_logged,
        referred_by_agency_code_ref,
      );
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-referral`, {
        complaint_identifier,
        referral_date,
        referred_by_agency_code_ref,
        referred_to_agency_code_ref,
        app_user_guid_ref,
        referral_reason,
        documentExportParams,
        complaint_url,
        externalAgencyInd,
        additionalEmailRecipients,
      });

      await post<any>(dispatch, parameters);

      ToggleSuccess("Complaint has been referred");
    } catch (error) {
      ToggleError("Unable to refer complaint");
    }
  };

//-- get complaint
export const getComplaintById =
  (id: string, complaintType: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/by-complaint-identifier/${complaintType}/${id}`,
      );
      const response = await get<ComplaintDtoAlias>(dispatch, parameters);
      dispatch(setComplaint({ ...response }));
    } catch (error) {
      dispatch(setComplaint(null));
    }
  };

export const getComplaintStatusById =
  (id: string, complaintType: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/by-complaint-identifier/${complaintType}/${id}`,
      );
      const response = await get<WildlifeComplaint | AllegationComplaint | GeneralIncidentComplaint | Complaint>(
        dispatch,
        parameters,
      );

      if (response.status) {
        dispatch(setComplaintStatus(response.status));
      }
    } catch (error) {
      //-- handle the error
    }
  };

export const getComplaintCollaboratorsByComplaintId =
  (complaintId: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/${complaintId}/collaborators`);
      const response = await get(dispatch, parameters);

      if (response) {
        dispatch(setComplaintCollaborators(response));
      }
    } catch (error) {
      console.error(`Unable to retrieve collaborators for complaint ${complaintId}: ${error}`);
    }
  };

export const addCollaboratorToComplaint =
  (complaintId: string, appUserGuid: string, complaintType: string, complaintUrl: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/${complaintId}/add-collaborator/${appUserGuid}`,
        {
          complaintType,
          complaintUrl,
          appUserGuid,
        },
      );
      await post(dispatch, parameters);
      dispatch(getComplaintCollaboratorsByComplaintId(complaintId));
    } catch (error) {
      console.error(`Unable to add collaborator to complaint ${complaintId}: ${error}`);
    }
  };

export const removeCollaboratorFromComplaint =
  (complaintId: string, appUserComplaintXrefGuid: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/${complaintId}/remove-collaborator/${appUserComplaintXrefGuid}`,
      );
      await patch(dispatch, parameters);
      dispatch(getComplaintCollaboratorsByComplaintId(complaintId));
    } catch (error) {
      console.error(`Unable to remove collaborator from complaint ${complaintId}: ${error}`);
    }
  };

export const getLinkedComplaints =
  (complaintIdentifier: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/linked-complaints/${complaintIdentifier}`,
      );
      const response: any = await get(dispatch, parameters);
      dispatch(setLinkedComplaints(response));
    } catch (error) {
      console.error(`Unable to retrieve linked complaints for complaint ${complaintIdentifier}: ${error}`);
    }
  };

export const getCaseFileComplaints =
  (complaintIds: string[]): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/sector-complaints-by-ids`, {
        ids: complaintIds,
      });
      const response = await get<ComplaintDtoAlias>(dispatch, parameters);
      dispatch(setCaseFileComplaints(response));
    } catch (error) {
      console.error("Unable to get complaints for case file", error);
      dispatch(setCaseFileComplaints(null));
    }
  };

export const createComplaint =
  (
    complaintType: string,
    complaint: ComplaintDtoAlias,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      codeTables: { "area-codes": areaCodes },
    } = getState();

    try {
      let result = "";

      const {
        location,
        locationSummary,
        organization: { area: community },
      } = complaint as Complaint;
      const { coordinates } = location;
      const selectedCommunity = areaCodes.find(({ area }) => area === community);

      if (coordinates[Coordinates.Latitude] === 0 && coordinates[Coordinates.Longitude] === 0) {
        const geocodeParameters = generateApiParameters(
          `${config.API_BASE_URL}/bc-geo-coder/address?localityName=${selectedCommunity?.areaName}&addressString=${locationSummary}`,
        );
        const geocodeResponse = await get<Feature>(dispatch, geocodeParameters);

        if (geocodeResponse?.features && geocodeResponse?.features.length === 1 && geocodeResponse?.minScore >= 90) {
          const geoCoderCoordinates = geocodeResponse?.features[0].geometry.coordinates;
          complaint = { ...complaint, location: { ...location, coordinates: geoCoderCoordinates } };
        }
      }

      if (selectedCommunity) {
        const { area, zone, region } = selectedCommunity;
        complaint = { ...complaint, organization: { area, region, zone } };
      }

      const postParameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/create/${complaintType}`,
        complaint,
      );

      await post<WildlifeComplaint | AllegationComplaint | GeneralIncidentComplaint | Complaint>(
        dispatch,
        postParameters,
      ).then(async (res) => {
        const { id } = res;
        result = id;
      });
      ToggleSuccess("Complaint has been saved");
      return result;
    } catch (error) {
      ToggleError("Unable to create complaint");
    }
  };

//-- selectors
export const selectComplaintSearchParameters = (state: RootState) => {
  const {
    complaints: { complaintSearchParameters },
  } = state;

  let activeFilters: Partial<ComplaintFilters> = {};
  Object.keys(complaintSearchParameters).forEach((key) => {
    const value = complaintSearchParameters[key as keyof ComplaintFilters];
    if (value !== undefined && value !== null) {
      activeFilters = {
        ...activeFilters,
        [key]: value,
      };
    }
  });

  return complaintSearchParameters;
};

export const selectGeocodedComplaintCoordinates = (state: RootState): Feature | null | undefined => {
  const {
    complaints: { complaintLocation },
  } = state;
  return complaintLocation;
};

export const selectWildlifeZagOpenComplaints = (state: RootState): ZoneAtAGlanceStats => {
  const {
    complaints: { zoneAtGlance },
  } = state;

  return zoneAtGlance.hwcr;
};

export const selectAllegationZagOpenComplaints = (state: RootState): ZoneAtAGlanceStats => {
  const {
    complaints: { zoneAtGlance },
  } = state;

  return zoneAtGlance.allegation;
};

export const selectWildlifeComplaints = (state: RootState): Array<WildlifeComplaint> => {
  const {
    complaints: { complaintItems },
  } = state;
  const { wildlife } = complaintItems;

  return wildlife;
};

export const selectSectorComplaints = (state: RootState): Array<any> => {
  const {
    complaints: { complaintItems },
  } = state;
  const { sector } = complaintItems;

  return sector;
};

export const selectAllegationComplaints = (state: RootState): Array<any> => {
  const {
    complaints: { complaintItems },
  } = state;
  const { allegations } = complaintItems;

  return allegations;
};

export const selectGeneralInformationComplaints = (state: RootState): Array<any> => {
  const {
    complaints: { complaintItems },
  } = state;
  const { general } = complaintItems;

  return general;
};

export const selectTotalComplaintsByType =
  (complaintType: string) =>
  (state: RootState): number => {
    const {
      complaints: { totalCount },
    } = state;

    return totalCount;
  };

export const selectComplaintsByType =
  (complaintType: string) =>
  (state: RootState): Array<WildlifeComplaint> | Array<AllegationComplaint> | Array<GeneralIncidentComplaint> => {
    switch (complaintType) {
      case COMPLAINT_TYPES.ERS:
        return selectAllegationComplaints(state);
      case COMPLAINT_TYPES.GIR:
        return selectGeneralInformationComplaints(state);
      case COMPLAINT_TYPES.HWCR:
        return selectWildlifeComplaints(state);
      case COMPLAINT_TYPES.SECTOR:
      default:
        return selectSectorComplaints(state);
    }
  };

export const selectTotalMappedComplaints = (state: RootState): number => {
  const {
    complaints: {
      mappedComplaintsCount: { mapped, unmapped },
    },
  } = state;
  return mapped + unmapped;
};

export const selectComplaint = (
  state: RootState,
): WildlifeComplaint | AllegationComplaint | GeneralIncidentComplaint | Complaint | null => {
  const {
    complaints: { complaint },
  } = state;
  return complaint;
};

export const selectCaseFileComplaints = (state: RootState): SectorComplaint[] | null => {
  const {
    complaints: { caseFileComplaints },
  } = state;
  return caseFileComplaints;
};

export const selectComplaintCollaborators = (state: RootState): Collaborator[] => {
  const {
    complaints: { complaintCollaborators },
  } = state;
  return complaintCollaborators;
};

export const selectActiveComplaintCollaborators = (state: RootState): Collaborator[] => {
  const {
    complaints: { complaintCollaborators },
  } = state;
  const activeCollaborators = complaintCollaborators.filter((collaborator) => collaborator.activeInd);
  return activeCollaborators;
};

export const selectComplaintLargeCarnivoreInd = createSelector(
  (state: RootState) => state.complaints.complaint,
  (complaint): boolean => {
    const complaintData = complaint as WildlifeComplaint;
    return complaintData ? complaintData.isLargeCarnivore : false;
  },
);

export const selectComplaintDetails = createSelector(
  [
    (state: RootState) => state.complaints.complaint,
    (state: RootState) => state.codeTables["area-codes"],
    (state: RootState) => state.codeTables.attractant,
    (state: RootState) => state.codeTables["nature-of-complaint"],
    (state: RootState) => state.codeTables["gir-type"],
    (state: RootState) => state.codeTables["violation"],
    (state: RootState) => state.codeTables["complaint-method-received-codes"],
    (_, complaintType: string) => complaintType,
  ],
  (
    complaint,
    areaCodes,
    attractantCodeTable,
    natureOfComplaintCodes,
    girTypeCodes,
    violationCodes,
    complaintMethodReceivedCodes,
    complaintType,
  ): ComplaintDetails => {
    const getAttractants = (attractants: AttractantXrefDto[], codes: AttractantDto[]): ComplaintDetailsAttractant[] => {
      return attractants.map(({ xrefId: key, attractant: code }) => {
        let record: ComplaintDetailsAttractant = { key: "", description: "", code };
        if (key) record = { ...record, key };
        const found = codes.find((item) => item.attractant === code);
        if (found) record = { ...record, description: found.shortDescription };
        return record;
      });
    };

    const getComplaintMethodReceivedCode = (
      code: string,
      codes: ComplaintMethodReceivedType[],
    ): ComplaintMethodReceivedType | null => {
      if (codes && from(codes).any(({ complaintMethodReceivedCode }) => complaintMethodReceivedCode === code)) {
        return from(codes).first(({ complaintMethodReceivedCode }) => complaintMethodReceivedCode === code);
      }
      return null;
    };

    let result: ComplaintDetails = {};

    if (complaint?.location) {
      const {
        details,
        locationSummary: location,
        locationDetail: locationDescription,
        incidentDateTime,
        location: { coordinates },
        organization: { area: areaCode, region, zone, officeLocation },
        ownedBy,
        parkGuid,
      } = complaint as Complaint;

      result = { ...result, details, location, locationDescription, incidentDateTime, coordinates, ownedBy, parkGuid };

      if (complaintType === "HWCR") {
        const { attractants } = complaint as WildlifeComplaint;
        if (attractants?.length) {
          result.attractants = getAttractants(attractants, attractantCodeTable);
        }
      } else if (complaintType === "ERS") {
        const { isInProgress: violationInProgress, wasObserved: violationObserved } = complaint as AllegationComplaint;
        result = { ...result, violationInProgress, violationObserved };
      } else if (complaintType === "GIR") {
        const { girType: girTypeCode } = complaint as GeneralIncidentComplaint;
        const girType = getGirTypeByGirTypeCode(girTypeCode, girTypeCodes);
        result = { ...result, girType, girTypeCode };
      } else if (complaintType === "SECTOR") {
        const issueType = getIssueDescription(complaint, natureOfComplaintCodes, girTypeCodes, violationCodes);
        result = { ...result, issueType };
      }

      const org = areaCodes.find(({ area }) => area === areaCode);
      if (org) {
        const { areaName, regionName, zoneName, officeLocationName } = org;
        result = {
          ...result,
          area: areaName,
          areaCode,
          region: regionName,
          regionCode: region,
          zone: zoneName,
          zone_code: zone,
          office: officeLocationName,
          officeCode: officeLocation,
        };
      }

      if (complaint) {
        const { complaintMethodReceivedCode }: any = complaint;
        result.complaintMethodReceivedCode =
          getComplaintMethodReceivedCode(complaintMethodReceivedCode, complaintMethodReceivedCodes) ?? undefined;
        result.parkGuid = complaint.parkGuid;
      }
    }
    return result;
  },
);

export const selectComplaintHeader =
  (complaintType: string) =>
  (state: RootState): ComplaintHeader => {
    const {
      complaints: { complaint },
      codeTables: {
        "complaint-status": statusCodes,
        violation: violationCodes,
        species: speciesCodes,
        "nature-of-complaint": natureOfComplaints,
        "gir-type": girTypeCodes,
      },
      parks: { parkCache },
      officers: { officers },
    } = state;

    const selectSharedHeader = () => {
      let result: ComplaintHeader = {
        loggedDate: "",
        createdBy: "",
        lastUpdated: "",
        status: "",
        statusCode: "",
        zone: "",
        officerAssigned: "",
        appUserGuid: "",
        complaintAgency: "",
        parkAreaGuids: [],
        type: "",
      };

      let officerAssigned = "Not Assigned";
      let appUserGuid = "";

      if (complaint) {
        const {
          reportedOn: loggedDate,
          createdBy,
          updatedOn: lastUpdated,
          status: statusCode,
          delegates,
          ownedBy: complaintAgency,
          organization: { zone },
          parkGuid,
          type,
        } = complaint as Complaint;

        const status = getStatusByStatusCode(statusCode, statusCodes);
        const park = parkGuid ? parkCache[parkGuid] : undefined;
        const parkAreaGuids = park?.parkAreas?.map((area) => area.parkAreaGuid) ?? [];

        result = {
          loggedDate: loggedDate.toString(),
          createdBy,
          lastUpdated: lastUpdated?.toString(),
          status,
          statusCode,
          zone,
          officerAssigned,
          appUserGuid,
          complaintAgency,
          parkAreaGuids,
          type,
        };

        if (delegates && from(delegates).any(({ isActive, type }) => type === "ASSIGNEE" && isActive)) {
          const assigned = from(delegates).first(({ isActive, type }) => type === "ASSIGNEE" && isActive);

          const assignedAppUserGuid = assigned.appUserGuid as string;

          const officer = officers.find((o) => o.app_user_guid === assignedAppUserGuid);
          if (officer) {
            officerAssigned = `${officer.last_name}, ${officer.first_name}`;
          }

          result = { ...result, officerAssigned, appUserGuid: assignedAppUserGuid };
        }
      }

      return result;
    };
    let result = selectSharedHeader();

    if (complaint) {
      switch (complaintType) {
        case COMPLAINT_TYPES.ERS:
          {
            const { violation: violationTypeCode } = complaint as AllegationComplaint;
            const violationType = getViolationByViolationCode(violationTypeCode, violationCodes);

            result = { ...result, violationType, violationTypeCode };
          }
          break;
        case COMPLAINT_TYPES.GIR:
          {
            const { girType: girTypeCode } = complaint as GeneralIncidentComplaint;
            const girType = getGirTypeByGirTypeCode(girTypeCode, girTypeCodes);
            result = { ...result, girType, girTypeCode };
          }
          break;
        case COMPLAINT_TYPES.HWCR:
        default:
          {
            const { species: speciesCode, natureOfComplaint: natureOfComplaintCode } = complaint as WildlifeComplaint;
            const species = getSpeciesBySpeciesCode(speciesCode, speciesCodes);
            const natureOfComplaint = getNatureOfComplaintByNatureOfComplaintCode(
              natureOfComplaintCode,
              natureOfComplaints,
            );

            result = { ...result, species, speciesCode, natureOfComplaint, natureOfComplaintCode };
          }
          break;
      }
    }

    return result;
  };

export const selectComplaintCallerInformation = createSelector(
  [
    (state: RootState) => state.complaints.complaint,
    (state: RootState) => state.codeTables.agency,
    (state: RootState) => state.codeTables["reported-by"],
  ],
  (complaint, agencyCodes, reportedByCodes): ComplaintCallerInformation => {
    const getAgencyByAgencyCode = (code: string, codes: Array<Agency>): Agency | null => {
      if (codes && from(codes).any(({ agency }) => agency === code)) {
        const selected = from(codes).first(({ agency }) => agency === code);
        return selected;
      }
      return null;
    };

    const getReportedByReportedByCode = (code: string, codes: Array<ReportedBy>): ReportedBy | null => {
      if (codes && from(codes).any(({ reportedBy }) => reportedBy === code)) {
        const selected = from(codes).first(({ reportedBy }) => reportedBy === code);
        return selected;
      }
      return null;
    };

    let results = {} as ComplaintCallerInformation;

    if (complaint) {
      const { name, phone1, phone2, phone3, address, email, reportedBy, ownedBy, isPrivacyRequested }: any = complaint;
      const reportedByCode = getReportedByReportedByCode(reportedBy, reportedByCodes);
      const ownedByAgencyCode = getAgencyByAgencyCode(ownedBy, agencyCodes);

      results = {
        ...results,
        name,
        primaryPhone: phone1,
        secondaryPhone: phone2,
        alternatePhone: phone3,
        address,
        email,
        isPrivacyRequested,
      };

      if (reportedByCode) {
        results = { ...results, reportedByCode };
      }

      if (ownedByAgencyCode) {
        results = { ...results, ownedByAgencyCode };
      }
    }
    return results;
  },
);

export const selectComplaintSuspectWitnessDetails = createSelector(
  (state: RootState) => state.complaints.complaint,
  (complaint): ComplaintSuspectWitness => {
    let results = {} as ComplaintSuspectWitness;
    if (complaint) {
      const { violationDetails: details } = complaint as AllegationComplaint;
      results = { ...results, details };
    }
    return results;
  },
);

export const selectComplaintAssignedBy = createSelector([selectComplaint], (complaint): string | null => {
  if (complaint?.delegates) {
    const { delegates } = complaint;
    if (from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.appUserGuid !== null) {
        const { appUserGuid } = assigned;

        return appUserGuid;
      }
    }
  }

  return null;
});

export const selectLinkedComplaints = (state: RootState): LinkedComplaint[] => {
  const {
    complaints: { linkedComplaints },
  } = state;
  return linkedComplaints;
};

//Get officer's auth_user_id that is assigned in a complaint
export const assignedOfficerAuthId = (state: RootState): string | null => {
  const {
    officers: { officers },
  } = state;

  const assignedAppUserGuid = selectComplaintAssignedBy(state);
  const result = officers.find((officer) => officer.app_user_guid === assignedAppUserGuid);

  if (result?.auth_user_guid) return result.auth_user_guid;
  return null;
};
export const selectWebEOCComplaintUpdates = createSelector(
  (state: RootState) => state.complaints.webeocUpdates,
  (webeocUpdates) => webeocUpdates,
);

export const selectRelatedData = createSelector(
  (state: RootState) => state.complaints.webeocUpdates,
  (state: RootState) => state.complaints.actions,
  (state: RootState) => state.complaints.referrals,
  (updates, actions, referrals) => ({ updates, actions, referrals }),
);

export const selectActions = createSelector(
  (state: RootState) => state.complaints.actions,
  (actions) => actions,
);

export const selectWebEOCChangeCount = createSelector(
  (state: RootState) => state.complaints.webeocChangeCount,
  (webeocChangeCount) => webeocChangeCount,
);

export const selectComplaintViewMode = createSelector(
  (state: RootState) => state.complaints.complaintView.isReadOnly,
  (isReadOnly) => isReadOnly,
);

export default complaintSlice.reducer;
