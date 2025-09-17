import { EquipmentActionItem } from "../equipment-action";

export interface CreateEquipmentDetailsInput {
  typeCode?: string;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  equipmentTypeActiveIndicator: boolean;
  actions: EquipmentActionItem[];
  wasAnimalCaptured: string;
  quantity?: number;
}
