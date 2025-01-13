import Option from "@apptypes/app/option";

export const ROLE_OPTIONS: Array<Option> = [
  { value: "CEEB", label: "CEEB User" },
  { value: "CEEB Section Head", label: "Section Head" },
  { value: "CEEB Compliance Coordinator", label: "Compliance Coordinator" },
  { value: "COS Officer", label: "COS Officer" },
  { value: "COS Administrator", label: "COS Administrator" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Inspector", label: "Inspector" },
  { value: "Province-wide", label: "Province-wide" },
];

export const CEEB_ROLE_OPTIONS: Array<Option> = [
  { value: "CEEB", label: "CEEB User" },
  { value: "CEEB Section Head", label: "Section Head" },
  { value: "CEEB Compliance Coordinator", label: "Compliance Coordinator" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Province-wide", label: "Province-wide" },
];

export const COS_ROLE_OPTIONS: Array<Option> = [
  { value: "COS Officer", label: "COS Officer" },
  { value: "COS Administrator", label: "COS Administrator" },
  { value: "READ ONLY", label: "Read Only" },
  { value: "Inspector", label: "Inspector" },
  { value: "Province-wide", label: "Province-wide" },
];
