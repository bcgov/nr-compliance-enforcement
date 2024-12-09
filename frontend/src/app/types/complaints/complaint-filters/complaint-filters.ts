import { DropdownOption } from "@apptypes/app/drop-down-option";
export type ComplaintFilters = {
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

  girType?: DropdownOption | null;

  complaintMethod: DropdownOption | null;

  actionTaken?: DropdownOption | null;
  outcomeAnimal?: DropdownOption | null;
  outcomeAnimalStartDate?: Date;
  outcomeAnimalEndDate?: Date;

  filters: Array<any>;
};
