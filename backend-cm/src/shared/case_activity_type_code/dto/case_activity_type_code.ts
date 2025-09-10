import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { case_activity_type_code } from "../../../../prisma/shared/generated/case_activity_type_code";

export class CaseActivityTypeCode {
  caseActivityTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  externalAgencyIndicator: boolean;
}

export const mapPrismaCaseActivityTypeCodeToCaseActivityTypeCode = (mapper: Mapper) => {
  createMap<case_activity_type_code, CaseActivityTypeCode>(
    mapper,
    "case_activity_type_code",
    "CaseActivityTypeCode",
    forMember(
      (dest) => dest.caseActivityTypeCode,
      mapFrom((src) => src.case_activity_type_code),
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
