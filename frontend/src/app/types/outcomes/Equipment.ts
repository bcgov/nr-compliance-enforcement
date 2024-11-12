import Option from "@apptypes/app/option";

export interface Equipment {
  id: string;
  type: Option;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  officerSet: Option;
  dateSet: Date;
  officerRemoved?: Option;
  dateRemoved?: Date;
  isEdit?: boolean;
}
