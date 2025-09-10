import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { case_status_code } from "../../../../prisma/shared/generated/case_status_code";

export class CaseStatusCode {
  caseStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  externalAgencyIndicator: boolean;
}

export const mapPrismaCaseStatusCodeToCaseStatusCode = (mapper: Mapper) => {
  createMap<case_status_code, CaseStatusCode>(
    mapper,
    "case_status_code",
    "CaseStatusCode",
    forMember(
      (dest) => dest.caseStatusCode,
      mapFrom((src) => src.case_status_code),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
