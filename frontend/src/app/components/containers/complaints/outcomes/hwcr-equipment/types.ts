import Option from "../../../../../types/app/option";

export interface IEquipment {
  type: Option | undefined;
  address: string | undefined;
  xCoordinate: string;
  yCoordinate: string;
  officerSet: Option | undefined;
  dateSet: Date | undefined;
  officerRemoved?: Option | undefined;
  dateRemoved?: Date | undefined;
  isEdit?: boolean;
}