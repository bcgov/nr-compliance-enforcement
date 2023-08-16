import { DropdownOption } from "../code-tables/option";

export interface ComplaintFilterState {
  [key: string]: any;

  region: DropdownOption | null;
  zone: DropdownOption | null;
  community: DropdownOption | null;
  officer: DropdownOption | null;

  startDate?: Date;
  endDate?: Date;
  status: DropdownOption | null;

  species: DropdownOption | null;
  natureOfComplaint: DropdownOption | null;

  violationType: DropdownOption | null;
}

export interface ComplaintFilter {
  filters?: ComplaintFilterState;

  setRegion: (data: DropdownOption | null) => void;
  setZone: (data: DropdownOption | null) => void;
  setCommunity: (data: DropdownOption | null) => void;
  setOfficer: (data: DropdownOption | null) => void;

  setStartDate: Function;
  setEndDate: Function;
  setStatus: (data: DropdownOption | null) => void;

  setSpecies: (data: DropdownOption | null) => void;
  setNatureOfComplaint: (data: DropdownOption | null) => void;

  setViolationType: (data: DropdownOption | null) => void;

  resetFilters: () => void;
  hasFilter: (filter: string) => boolean;
  hasDate: () => boolean;
}
