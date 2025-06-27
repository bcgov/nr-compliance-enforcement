import Option from "@apptypes/app/option";

export const ROLE_OPTIONS: Array<Option> = [
  { value: "COS", label: "COS" },
  { value: "CEEB", label: "CEEB User" },
  { value: "PARKS", label: "PARKS" },
  { value: "COS Administrator", label: "COS Administrator" },
  { value: "CEEB Section Head", label: "Section Head" },
  { value: "CEEB Compliance Coordinator", label: "Compliance Coordinator" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Inspector", label: "Inspector" },
  { value: "Province-wide", label: "Province-wide" },
  { value: "HWCR only", label: "HWCR only" },
  { value: "SECTOR", label: "SECTOR" },
];

export const CEEB_ROLE_OPTIONS: Array<Option> = [
  { value: "CEEB", label: "CEEB User" },
  { value: "CEEB Section Head", label: "Section Head" },
  { value: "CEEB Compliance Coordinator", label: "Compliance Coordinator" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Province-wide", label: "Province-wide" },
];

export const COS_ROLE_OPTIONS: Array<Option> = [
  { value: "COS", label: "COS" },
  { value: "COS Administrator", label: "COS Administrator" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Inspector", label: "Inspector" },
  { value: "Province-wide", label: "Province-wide" },
  { value: "HWCR only", label: "HWCR only" },
];

export const PARKS_ROLE_OPTIONS: Array<Option> = [
  { value: "PARKS", label: "PARKS" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Province-wide", label: "Province-wide" },
];

export const SECTOR_ROLE_OPTIONS: Array<Option> = [{ value: "SECTOR", label: "SECTOR" }];
