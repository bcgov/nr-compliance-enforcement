import Option from "../../../../../types/app/option";

export interface IEquipment {
  id: string | undefined;
  type: Option | undefined;
  address: string | undefined;
  xCoordinate: string;
  yCoordinate: string;
  officerSet: Option | undefined;
  dateSet: Date | undefined;
  officerRemoved?: Option;
  dateRemoved?: Date;
  isEdit?: boolean;
}