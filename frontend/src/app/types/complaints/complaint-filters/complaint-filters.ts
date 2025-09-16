import { DropdownOption } from "@apptypes/app/drop-down-option";
import Option from "@apptypes/app/option";

export type ComplaintFilters = {
  [key: string]: any;

  agency: DropdownOption | null;
  complaintType: DropdownOption | null;
  region: DropdownOption | null;
  zone: DropdownOption | null;
  community: DropdownOption | null;
  park: DropdownOption | null;
  area: DropdownOption | null;
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
  outcomeActionedBy?: DropdownOption;

  equipmentStatus?: DropdownOption | null;
  equipmentTypes?: Option[];

  filters: Array<any>;
};
