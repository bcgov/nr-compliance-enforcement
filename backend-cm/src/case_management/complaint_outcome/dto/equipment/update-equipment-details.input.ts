import { EquipmentActionItem } from "../equipment-action";

export interface UpdateEquipmentDetailsInput {
  id?: string;
  typeCode?: string;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  actionEquipmentTypeActiveIndicator: boolean;
  actions: EquipmentActionItem[];
  wasAnimalCaptured: string;
  quantity?: number;
}
