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
import { generateApiParameters, get, patch, post } from "@common/api";
import { ComplaintQueryParams } from "@apptypes/api-params/complaint-query-params";
import { Feature } from "@apptypes/maps/bcGeocoderType";
import { ToggleSuccess, ToggleError } from "@common/toast";
import { ComplaintSearchResults } from "@apptypes/api-params/complaint-results";
import { Coordinates } from "@apptypes/app/coordinate-type";

import { WildlifeComplaint as WildlifeComplaintDto } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "@apptypes/app/complaints/allegation-complaint";
import { Complaint as ComplaintDto } from "@apptypes/app/complaints/complaint";
import { AttractantXref as AttractantXrefDto } from "@apptypes/app/complaints/attractant-xref";
import { Attractant as AttractantDto } from "@apptypes/app/code-tables/attactant";

import { from } from "linq-to-typescript";
import {
  getNatureOfComplaintByNatureOfComplaintCode,
  getSpeciesBySpeciesCode,
  getStatusByStatusCode,
  getViolationByViolationCode,
  getGirTypeByGirTypeCode,
} from "@common/methods";
import { Agency } from "@apptypes/app/code-tables/agency";
import { ReportedBy } from "@apptypes/app/code-tables/reported-by";
import { WebEOCComplaintUpdateDTO } from "@apptypes/app/complaints/webeoc-complaint-update";
import { RelatedData } from "@apptypes/app/complaints/related-data";
import { ActionTaken } from "@apptypes/app/complaints/action-taken";

import { GeneralIncidentComplaint as GeneralIncidentComplaintDto } from "@apptypes/app/complaints/general-complaint";
import { ComplaintMethodReceivedType } from "@apptypes/app/code-tables/complaint-method-received-type";
import { LinkedComplaint } from "@/app/types/app/complaints/linked-complaint";

type dtoAlias = WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto;

const initialState: ComplaintState = {
  complaintSearchParameters: { sortColumn: "", sortOrder: "" },
  complaintItems: {
    wildlife: [],
    allegations: [],
    general: [],
  },
  totalCount: 0,
  complaint: null,
  complaintLocation: null,

  zoneAtGlance: {
    hwcr: { assigned: 0, unassigned: 0, total: 0, offices: [] },
    allegation: { assigned: 0, unassigned: 0, total: 0, offices: [] },
  },

  mappedComplaintsCount: { mapped: 0, unmapped: 0 },

  webeocUpdates: [],
  actions: [],

  webeocChangeCount: 0,
  linkedComplaints: [],
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

      let update: ComplaintCollection = { wildlife: [], allegations: [], general: [] };
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
      }
      return { ...state, complaintItems: update };
    },
    setTotalCount(state, action) {
      state.totalCount = action.payload;
    },

    setComplaint: (state, action) => {
      const { payload: complaint } = action;
      return { ...state, complaint };
    },

    clearComplaint: (state) => {
      return { ...state, complaint: null };
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
    updateWildlifeComplaintByRow: (state, action: PayloadAction<WildlifeComplaintDto>) => {
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
    updateGeneralComplaintByRow: (state, action: PayloadAction<GeneralIncidentComplaintDto>) => {
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
    updateAllegationComplaintByRow: (state, action: PayloadAction<AllegationComplaintDto>) => {
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
    updateGeneralIncidentComplaintByRow: (state, action: PayloadAction<GeneralIncidentComplaintDto>) => {
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
        payload: { updates: webeocUpdates, actions },
      } = action;
      return { ...state, webeocUpdates, actions };
    },
    setActions: (state, action: PayloadAction<ActionTaken[]>) => {
      state.actions = action.payload;
    },
    setWebEOCChangeCount: (state, action: PayloadAction<number>) => {
      state.webeocChangeCount = action.payload;
    },

    setComplaintStatus: (state, action) => {
      if (state.complaint) {
        state.complaint.status = action.payload;
      }
    },
    setLinkedComplaints: (state, action) => {
      return { ...state, linkedComplaints: action.payload };
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
} = complaintSlice.actions;

//-- redux thunks
export const refreshComplaints =
  (complaintType: string): AppThunk =>
  async (dispatch, getState) => {
    const { complaintSearchParameters } = getState().complaints;
    dispatch(getComplaints(complaintType, complaintSearchParameters));
  };
export const getComplaints =
  (complaintType: string, payload: ComplaintFilters): AppThunk =>
  async (dispatch, getState) => {
    const {
      sortColumn,
      sortOrder,
      regionCodeFilter,
      areaCodeFilter,
      zoneCodeFilter,
      officerFilter,
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
      page,
      pageSize,
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
        officerAssigned: officerFilter?.value,
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
        page: page,
        pageSize: pageSize,
        query: query,
      });

      const { complaints, totalCount } = await get<ComplaintSearchResults, ComplaintQueryParams>(dispatch, parameters);

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
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint-updates/related/${complaintIdentifier}`,
      );
      const response = await get<RelatedData>(dispatch, parameters);
      dispatch(setRelatedData(response));
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

  await patch<ComplaintDto>(dispatch, parameters);
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

      const response = await get<WildlifeComplaintDto>(dispatch, parameters);

      dispatch(updateWildlifeComplaintByRow(response as WildlifeComplaintDto));
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
      const response = await get<AllegationComplaintDto>(dispatch, parameters);
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
      const response = await get<GeneralIncidentComplaintDto>(dispatch, parameters);
      dispatch(updateGeneralIncidentComplaintByRow(response));
      const result = response;

      dispatch(setComplaint({ ...result }));
    } catch (error) {
      //-- add error handling
    }
  };

export const updateComplaintById =
  (
    complaint: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto,
    complaintType: string,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const { id } = complaint;

      const updateParams = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/update-by-id/${complaintType}/${id}`,
        complaint,
      );

      await patch<dtoAlias>(dispatch, updateParams);

      ToggleSuccess("Updates have been saved");
    } catch (error) {
      ToggleError("Unable to update complaint");
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
      const response = await get<WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto>(
        dispatch,
        parameters,
      );

      dispatch(setComplaint({ ...response }));
    } catch (error) {
      //-- handle the error
    }
  };

export const getComplaintStatusById =
  (id: string, complaintType: string): AppThunk =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint/by-complaint-identifier/${complaintType}/${id}`,
      );
      const response = await get<WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto>(
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

export const createComplaint =
  (
    complaintType: string,
    complaint: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto,
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
      } = complaint as ComplaintDto;
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

      await post<WildlifeComplaintDto | AllegationComplaintDto>(dispatch, postParameters).then(async (res) => {
        const { id } = res;
        result = id;

        await dispatch(getComplaintById(id, "HWCR"));
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

export const selectWildlifeComplaints = (state: RootState): Array<WildlifeComplaintDto> => {
  const {
    complaints: { complaintItems },
  } = state;
  const { wildlife } = complaintItems;

  return wildlife;
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
  (
    state: RootState,
  ): Array<WildlifeComplaintDto> | Array<AllegationComplaintDto> | Array<GeneralIncidentComplaintDto> => {
    switch (complaintType) {
      case COMPLAINT_TYPES.ERS:
        return selectAllegationComplaints(state);
      case COMPLAINT_TYPES.GIR:
        return selectGeneralInformationComplaints(state);
      case COMPLAINT_TYPES.HWCR:
      default:
        return selectWildlifeComplaints(state);
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
): WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto | null => {
  const {
    complaints: { complaint },
  } = state;
  return complaint;
};

export const selectComplaintLargeCarnivoreInd = (state: RootState): boolean => {
  const {
    complaints: { complaint },
  } = state;
  const complaintData = complaint as WildlifeComplaintDto;
  if (complaintData) return complaintData.isLargeCarnivore;
  return false;
};

export const selectComplaintDetails = createSelector(
  [
    (state: RootState) => state.complaints.complaint,
    (state: RootState) => state.codeTables["area-codes"],
    (state: RootState) => state.codeTables.attractant,
    (state: RootState) => state.codeTables["gir-type"],
    (state: RootState) => state.codeTables["complaint-method-received-codes"],
    (_, complaintType: string) => complaintType,
  ],
  (
    complaint,
    areaCodes,
    attractantCodeTable,
    girTypeCodes,
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
      } = complaint as ComplaintDto;

      result = { ...result, details, location, locationDescription, incidentDateTime, coordinates };

      if (complaintType === "HWCR") {
        const { attractants } = complaint as WildlifeComplaintDto;
        if (attractants?.length) {
          result.attractants = getAttractants(attractants, attractantCodeTable);
        }
      } else if (complaintType === "ERS") {
        const { isInProgress: violationInProgress, wasObserved: violationObserved } =
          complaint as AllegationComplaintDto;
        result = { ...result, violationInProgress, violationObserved };
      } else if (complaintType === "GIR") {
        const { girType: girTypeCode } = complaint as GeneralIncidentComplaintDto;
        const girType = getGirTypeByGirTypeCode(girTypeCode, girTypeCodes);
        result = { ...result, girType, girTypeCode };
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
        personGuid: "",
        complaintAgency: "",
      };

      let officerAssigned = "Not Assigned";
      let personGuid = "";

      if (complaint) {
        const {
          reportedOn: loggedDate,
          createdBy,
          updatedOn: lastUpdated,
          status: statusCode,
          delegates,
          ownedBy: complaintAgency,
          organization: { zone },
        } = complaint as ComplaintDto;

        const status = getStatusByStatusCode(statusCode, statusCodes);

        result = {
          loggedDate: loggedDate.toString(),
          createdBy,
          lastUpdated: lastUpdated?.toString(),
          status,
          statusCode,
          zone,
          officerAssigned,
          personGuid,
          complaintAgency,
        };

        if (delegates && from(delegates).any(({ isActive, type }) => type === "ASSIGNEE" && isActive)) {
          const assigned = from(delegates).first(({ isActive, type }) => type === "ASSIGNEE" && isActive);

          const {
            person: { firstName, lastName, id },
          } = assigned;
          officerAssigned = `${lastName}, ${firstName}`;
          personGuid = id as string;

          result = { ...result, firstName, lastName, officerAssigned, personGuid };
        }
      }

      return result;
    };

    let result = selectSharedHeader();

    if (complaint) {
      switch (complaintType) {
        case COMPLAINT_TYPES.ERS:
          {
            const { violation: violationTypeCode } = complaint as AllegationComplaintDto;
            const violationType = getViolationByViolationCode(violationTypeCode, violationCodes);

            result = { ...result, violationType, violationTypeCode };
          }
          break;
        case COMPLAINT_TYPES.GIR:
          {
            const { girType: girTypeCode } = complaint as GeneralIncidentComplaintDto;
            const girType = getGirTypeByGirTypeCode(girTypeCode, girTypeCodes);
            result = { ...result, girType, girTypeCode };
          }
          break;
        case COMPLAINT_TYPES.HWCR:
        default:
          {
            const { species: speciesCode, natureOfComplaint: natureOfComplaintCode } =
              complaint as WildlifeComplaintDto;
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

export const selectComplaintCallerInformation = (state: RootState): ComplaintCallerInformation => {
  const {
    complaints: { complaint },
    codeTables: { agency: agencyCodes, "reported-by": reportedByCodes },
  } = state;

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
};

export const selectComplaintSuspectWitnessDetails = (state: RootState): ComplaintSuspectWitness => {
  const {
    complaints: { complaint },
  } = state;

  let results = {} as ComplaintSuspectWitness;

  if (complaint) {
    const { violationDetails: details } = complaint as AllegationComplaintDto;

    results = { ...results, details };
  }

  return results;
};

export const selectComplaintAssignedBy = createSelector([selectComplaint], (complaint): string | null => {
  if (complaint?.delegates) {
    const { delegates } = complaint;
    if (from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.person !== null) {
        const {
          person: { id },
        } = assigned;

        return id;
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

  const assignedOfficerPersonId = selectComplaintAssignedBy(state);
  const result = officers.find((officer) => officer.person_guid.person_guid === assignedOfficerPersonId);

  if (result?.auth_user_guid) return result.auth_user_guid;
  return null;
};

export const selectWebEOCComplaintUpdates = (state: RootState): WebEOCComplaintUpdateDTO[] | null => {
  const {
    complaints: { webeocUpdates },
  } = state;
  return webeocUpdates;
};
export const selectRelatedData = (state: RootState): RelatedData | null => {
  const {
    complaints: { webeocUpdates, actions },
  } = state;
  return { updates: webeocUpdates, actions };
};
export const selectActions = (state: RootState): ActionTaken[] | null => {
  const {
    complaints: { actions },
  } = state;
  return actions;
};
export const selectWebEOCChangeCount = (state: RootState): number | null => {
  const {
    complaints: { webeocChangeCount },
  } = state;
  return webeocChangeCount;
};

export default complaintSlice.reducer;
