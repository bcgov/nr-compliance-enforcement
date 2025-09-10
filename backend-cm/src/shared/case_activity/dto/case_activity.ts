import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { case_activity } from "../../../../prisma/shared/generated/case_activity";
import { CaseActivityTypeCode } from "../../case_activity_type_code/dto/case_activity_type_code";

export class CaseActivity {
  caseActivityGuid: string;
  caseFileGuid: string;
  activityType: CaseActivityTypeCode;
  activityIdentifier: string;
  caseActivityIdentifier: string;
  effectiveDate: Date;
  expiryDate: Date;
}

export const mapPrismaCaseActivityToCaseActivity = (mapper: Mapper) => {
  createMap<case_activity, CaseActivity>(
    mapper,
    "case_activity",
    "CaseActivity",
    forMember(
      (dest) => dest.caseActivityGuid,
      mapFrom((src) => src.case_activity_guid),
    ),
    forMember(
      (dest) => dest.caseFileGuid,
      mapFrom((src) => src.case_file_guid),
    ),
    forMember(
      (dest) => dest.activityIdentifier,
      mapFrom((src) => src.activity_identifier_ref),
    ),
    forMember(
      (dest) => dest.caseActivityIdentifier,
      mapFrom((src) => src.activity_identifier_ref),
    ),
    forMember(
      (dest) => dest.effectiveDate,
      mapFrom((src) => src.effective_utc_timestamp),
    ),
    forMember(
      (dest) => dest.expiryDate,
      mapFrom((src) => src.expiry_utc_timestamp),
    ),
    forMember(
      (dest) => dest.activityType,
      mapFrom((src) => mapper.map(src.case_activity_type_code, "case_activity_type_code", "CaseActivityTypeCode")),
    ),
  );
};
