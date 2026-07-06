import Option from "@apptypes/app/option";

export enum PropertyTypeEnum {
  SEIZED = "S",
  FOUND = "F",
}

export const PROPERTY_TYPE_OPTIONS: Option[] = [
  { value: PropertyTypeEnum.SEIZED, label: "Seized" },
  { value: PropertyTypeEnum.FOUND, label: "Found" },
];

export const getPropertyTypeLabel = (propertyType?: string | null): string => {
  if (!propertyType) return "-";
  return PROPERTY_TYPE_OPTIONS.find((option) => option.value === propertyType)?.label ?? propertyType;
};
