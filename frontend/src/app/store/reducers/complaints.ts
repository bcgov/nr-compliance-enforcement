import { Action, Dispatch, PayloadAction, ThunkAction, createSlice, current } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";
import config from "../../../config";
import { ComplaintCollection, ComplaintState } from "../../types/state/complaint-state";
import { ComplaintHeader } from "../../types/complaints/details/complaint-header";
import COMPLAINT_TYPES from "../../types/app/complaint-types";
import { ComplaintDetails } from "../../types/complaints/details/complaint-details";
import { ComplaintDetailsAttractant } from "../../types/complaints/details/complaint-attactant";
import { ComplaintCallerInformation } from "../../types/complaints/details/complaint-caller-information";
import { ComplaintSuspectWitness } from "../../types/complaints/details/complaint-suspect-witness-details";
import ComplaintType from "../../constants/complaint-types";
import { ZoneAtAGlanceStats } from "../../types/complaints/zone-at-a-glance-stats";
import { ComplaintFilters } from "../../types/complaints/complaint-filters";
import { generateApiParameters, get, patch, post } from "../../common/api";
import { ComplaintQueryParams } from "../../types/api-params/complaint-query-params";
import { Feature } from "../../types/maps/bcGeocoderType";
import { ToggleSuccess, ToggleError } from "../../common/toast";
import { ComplaintSearchResults } from "../../types/api-params/complaint-results";
import { Coordinates } from "../../types/app/coordinate-type";

import { MapSearchResults } from "../../types/complaints/map-return";
import { ComplaintMapItem } from "../../types/app/complaints/complaint-map-item";

import { WildlifeComplaint as WildlifeComplaintDto } from "../../types/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "../../types/app/complaints/allegation-complaint";
import { Complaint as ComplaintDto } from "../../types/app/complaints/complaint";
import { AttractantXref as AttractantXrefDto } from "../../types/app/complaints/attractant-xref";
import { Attractant as AttractantDto } from "../../types/app/code-tables/attactant";

import { from } from "linq-to-typescript";
import {
  getNatureOfComplaintByNatureOfComplaintCode,
  getSpeciesBySpeciesCode,
  getStatusByStatusCode,
  getViolationByViolationCode,
  getGirTypeByGirTypeCode,
} from "../../common/methods";
import { Agency } from "../../types/app/code-tables/agency";
import { ReportedBy } from "../../types/app/code-tables/reported-by";
import { WebEOCComplaintUpdateDTO } from "../../types/app/complaints/webeoc-complaint-update";
import { GeneralIncidentComplaint as GeneralIncidentComplaintDto } from "../../types/app/complaints/general-complaint";

type dtoAlias = WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto;

const initialState: ComplaintState = {
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

  mappedItems: { items: [], unmapped: 0 },

  webeocUpdates: [],
};
export const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
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
        const { status, delegates } = updatedComplaint;

        let complaint = { ...wildlife[index], status, delegates };

        const update = [...wildlife];
        update[index] = complaint;

        const updatedItems = { ...complaintItems, wildlife: update };

        return { ...state, complaintItems: updatedItems };
      }
    },

    updateAllegationComplaintByRow: (state, action: PayloadAction<AllegationComplaintDto>) => {
      const { payload: updatedComplaint } = action;
      const { complaintItems } = current(state);
      const { allegations } = complaintItems;

      const index = allegations.findIndex(({ ersId }) => ersId === updatedComplaint.ersId);

      if (index !== -1) {
        const { status, delegates } = updatedComplaint;

        let complaint = { ...allegations[index], status, delegates };

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
        const { status, delegates } = updatedComplaint;

        let complaint = { ...general[index], status, delegates };

        const update = [...general];
        update[index] = complaint;

        const updatedItems = { ...complaintItems, general: update };

        return { ...state, complaintItems: updatedItems };
      }
    },
    setMappedComplaints: (state, action) => {
      const { mappedItems } = state;
      const {
        payload: { complaints, unmappedComplaints },
      } = action;

      const update = {
        ...mappedItems,
        items: complaints,
        unmapped: unmappedComplaints,
      };

      return { ...state, mappedItems: update };
    },

    setWebEOCUpdates: (state, action: PayloadAction<WebEOCComplaintUpdateDTO[]>) => {
      state.webeocUpdates = action.payload;
    },
    setComplaintStatus: (state, action) => {
      if (state.complaint) {
        state.complaint.status = action.payload;
      }
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

// export the actions/reducers
export const {
  setComplaints,
  setTotalCount,
  setComplaint,
  setGeocodedComplaintCoordinates,
  setZoneAtAGlance,
  updateWildlifeComplaintByRow,
  updateAllegationComplaintByRow,
  updateGeneralIncidentComplaintByRow,
  setMappedComplaints,
  setWebEOCUpdates,
  setComplaintStatus,
} = complaintSlice.actions;

//-- redux thunks
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
      page,
      pageSize,
      query,
    } = payload;

    try {
      dispatch(setComplaint(null));

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

export const getMappedComplaints =
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
      complaintStatusFilter,
      page,
      pageSize,
      query,
    } = payload;

    try {
      dispatch(setComplaint(null));

      let parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/map/search/${complaintType}`, {
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
        status: complaintStatusFilter?.value,
        page: page,
        pageSize: pageSize,
        query: query,
      });

      const response = await get<MapSearchResults, ComplaintQueryParams>(dispatch, parameters);

      dispatch(setMappedComplaints(response));
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
      dispatch(setComplaint(null));

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
      //-- add error handling
    }
  };

//-- selectors
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
      mappedItems: { items, unmapped },
    },
  } = state;

  if (items && unmapped) {
    return items.length + unmapped;
  } else if (!items && !unmapped) {
    return 0;
  } else {
    return 0 + unmapped;
  }
};

export const selectTotalUnmappedComplaints = (state: RootState): number => {
  const {
    complaints: {
      mappedItems: { unmapped },
    },
  } = state;

  return unmapped;
};

export const selectMappedComplaints = (state: RootState): Array<ComplaintMapItem> => {
  const {
    complaints: {
      mappedItems: { items },
    },
  } = state;

  if (items) {
    const records = items.map(({ id, location: { coordinates } }) => {
      const record: ComplaintMapItem = {
        id,
        latitude: coordinates[Coordinates.Latitude],
        longitude: coordinates[Coordinates.Longitude],
      };

      return record;
    });

    return records;
  } else {
    return new Array<ComplaintMapItem>();
  }
};

export const selectComplaint = (
  state: RootState,
): WildlifeComplaintDto | AllegationComplaintDto | GeneralIncidentComplaintDto | null => {
  const {
    complaints: { complaint },
  } = state;
  return complaint;
};

export const selectComplaintDetails =
  (complaintType: string) =>
  (state: RootState): ComplaintDetails => {
    const {
      complaints: { complaint },
      codeTables: { "area-codes": areaCodes, attractant: attractantCodeTable, "gir-type": girTypeCodes },
    } = state;

    const getAttractants = (
      attractants: Array<AttractantXrefDto>,
      codes: Array<AttractantDto>,
    ): Array<ComplaintDetailsAttractant> => {
      const result = attractants.map(({ xrefId: key, attractant: code }) => {
        let record: ComplaintDetailsAttractant = { key: "", description: "", code };

        if (key) {
          record = { ...record, key };
        }

        const attractant = codes.find((item) => item.attractant === code);
        if (attractant) {
          const { shortDescription: description } = attractant;

          record = { ...record, description };
        }

        return record;
      });

      return result;
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

      result = {
        ...result,
        details,
        location,
        locationDescription,
        incidentDateTime,
        coordinates,
      };

      if (complaintType === "HWCR") {
        const { attractants } = complaint as WildlifeComplaintDto;

        if (attractants && from(attractants).any()) {
          let items = getAttractants(attractants, attractantCodeTable);
          result = { ...result, attractants: items };
        }
      } else if (complaintType === "ERS") {
        const { isInProgress: violationInProgress, wasObserved: violationObserved } =
          complaint as AllegationComplaintDto;

        result = {
          ...result,
          violationInProgress,
          violationObserved,
        };
      } else if (complaintType === "GIR") {
        const { girType: girTypeCode } = complaint as GeneralIncidentComplaintDto;
        const girType = getGirTypeByGirTypeCode(girTypeCode, girTypeCodes);
        result = {
          ...result,
          girType,
          girTypeCode,
        };
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
    }

    return result;
  };

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
          lastUpdated: lastUpdated.toString(),
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
    const { name, phone1, phone2, phone3, address, email, reportedBy, ownedBy }: any = complaint;
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

export const selectComplaintAssignedBy = (state: RootState): string | null => {
  const {
    complaints: { complaint },
  } = state;

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
};

export const selectWebEOCComplaintUpdates = (state: RootState): WebEOCComplaintUpdateDTO[] | null => {
  const {
    complaints: { webeocUpdates },
  } = state;
  return webeocUpdates;
};

export default complaintSlice.reducer;
