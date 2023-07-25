import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AgencyCode } from '../../types/code-tables/agency-code';
import { ComplaintStatusCode } from '../../types/code-tables/complaint-status-code';
import { AppThunk, RootState } from '../store';
import axios from 'axios';
import config from '../../../config';
import { SpeciesCode } from '../../types/code-tables/species-code';
import { ViolationCode } from '../../types/code-tables/violation-code';
import { HwcrNatureOfComplaintCode } from '../../types/code-tables/hwcr-nature-of-complaint-code';
import { DropdownOption } from '../../types/code-tables/option';
import { CosGeoOrgUnit } from '../../types/person/person';
import { AttractantCode } from '../../types/code-tables/attractant-code';

// Define an interface for the dropdown state
interface DropdownState {
  agencyCodes: DropdownOption[];
  complaintStatusCodes: DropdownOption[];
  violationCodes: DropdownOption[];
  speciesCodes: DropdownOption[];
  hwcrNatureOfComplaintCodes: DropdownOption[];
  areaCodes: DropdownOption[];
  attractantCodes: DropdownOption[];
  loading: boolean;
  error: string | null;
}

// Async thunk to fetch dropdown options
export const fetchCodeTablesAsync = createAsyncThunk<
  DropdownState,
  undefined,
  { rejectValue: string }
>('dropdown/fetchCodeTables', async (_, { rejectWithValue }) => {
  try {
    
    const token = localStorage.getItem("user");
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    // Perform the API requests to fetch dropdown options from REST endpoints
    const agencyCodeResponse = await axios.get(`${config.API_BASE_URL}/v1/agency-code`);
    const agencyCodes = await agencyCodeResponse.data;
    
    const complaintStatusCodeResponse = await axios.get(`${config.API_BASE_URL}/v1/complaint-status-code`);
    const complaintStatusCodes = await complaintStatusCodeResponse.data;

    const speciesCodeResponse = await axios.get(`${config.API_BASE_URL}/v1/species-code`);
    const speciesCodes = await speciesCodeResponse.data;

    const violationCodeResponse = await axios.get(`${config.API_BASE_URL}/v1/violation-code`);
    const violationCodes = await violationCodeResponse.data;

    const hwcrNatureOfComplaintCodeResponse = await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint-nature-code`);
    const hwcrNatureOfComplaintCodes = await hwcrNatureOfComplaintCodeResponse.data;

    const areaCodesResponse = await axios.get(`${config.API_BASE_URL}/v1/cos-geo-org-unit`);
    const areaCodes = await areaCodesResponse.data;

    const attractantCodesResponse = await axios.get(`${config.API_BASE_URL}/v1/attractant-code`);
    const attractantCodes = await attractantCodesResponse.data;

    // Transform the fetched data into the DropdownOption type
    const transformedAgencyCodes = agencyCodes.map((agencyCode: AgencyCode) => ({
      value: agencyCode.agency_code,
      label: agencyCode.long_description,
    }));
    const transformedComplaintStatusCodes = complaintStatusCodes.map((complaintStatusCode: ComplaintStatusCode) => ({
      value: complaintStatusCode.complaint_status_code,
      label: complaintStatusCode.long_description,
    }));

    const transformedSpeciesCodes = speciesCodes.map((speciesCode: SpeciesCode) => ({
      value: speciesCode.species_code,
      label: speciesCode.long_description,
    }));

    const transformedViolationCodes = violationCodes.map((violationCode: ViolationCode) => ({
      value: violationCode.violation_code,
      label: violationCode.long_description,
    }));
    const transformedHwcrNatureOfComplaintCodes = hwcrNatureOfComplaintCodes.map((hwcrNatureOfComplaintCode: HwcrNatureOfComplaintCode) => ({
      value: hwcrNatureOfComplaintCode.hwcr_complaint_nature_code,
      label: hwcrNatureOfComplaintCode.long_description,
    }));

    const transformedAreaCodes = areaCodes.map((areaCode: CosGeoOrgUnit) => ({
      value: areaCode.area_code,
      label: areaCode.area_name,
    }));

    const transformedAttractantCodes = attractantCodes.map((attractantCode: AttractantCode) => ({
      value: attractantCode.attractant_code,
      label: attractantCode.long_description,
    }));

    // Return the fetched dropdown options
    return {
      agencyCodes: transformedAgencyCodes,
      complaintStatusCodes: transformedComplaintStatusCodes,
      speciesCodes: transformedSpeciesCodes,
      violationCodes: transformedViolationCodes,
      hwcrNatureOfComplaintCodes: transformedHwcrNatureOfComplaintCodes,
      areaCodes: transformedAreaCodes,
      attractantCodes: transformedAttractantCodes,
      loading: false,
      error: null,
    };
  } catch (error) {
    // Handle API request errors
    return rejectWithValue('Failed to fetch dropdown options.');
  }
});

const initialState: DropdownState = {
  complaintStatusCodes: [],
  agencyCodes: [],
  speciesCodes: [],
  violationCodes: [],
  hwcrNatureOfComplaintCodes: [],
  areaCodes: [],
  attractantCodes: [],
  loading: false,
  error: null,
};

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCodeTablesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCodeTablesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.agencyCodes = action.payload.agencyCodes;
        state.complaintStatusCodes = action.payload.complaintStatusCodes;
        state.speciesCodes = action.payload.speciesCodes;
        state.violationCodes = action.payload.violationCodes;
        state.hwcrNatureOfComplaintCodes = action.payload.hwcrNatureOfComplaintCodes;
        state.areaCodes = action.payload.areaCodes;
        state.attractantCodes = action.payload.attractantCodes;
      })
      .addCase(fetchCodeTablesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAgencyCodes = (state: RootState) => state.dropdowns.agencyCodes;
export const selectComplaintStatusCodes = (state: RootState) => state.dropdowns.complaintStatusCodes;
export const selectSpeciesCodes = (state: RootState) => state.dropdowns.speciesCodes;
export const selectViolationCodes = (state: RootState) => state.dropdowns.violationCodes;
export const selectedHwcrNatureOfComplaintCodes = (state: RootState) => state.dropdowns.hwcrNatureOfComplaintCodes;
export const selectedAreaCodes = (state: RootState) => state.dropdowns.areaCodes;
export const selectedAttractantCodes = (state: RootState) => state.dropdowns.attractantCodes;

export default dropdownSlice.reducer;
