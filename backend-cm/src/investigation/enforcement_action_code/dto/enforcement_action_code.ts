import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { enforcement_action_code_agency_xref } from "prisma/investigation/generated/enforcement_action_code_agency_xref";

export class EnforcementActionCode {
  enforcementActionCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  agencyCode: string;
}

export const mapPrismaEnforcementActionCodeToEnforcementActionCode = (mapper: Mapper) => {
  createMap<enforcement_action_code_agency_xref, EnforcementActionCode>(
    mapper,
    "enforcement_action_code_agency_xref",
    "EnforcementActionCode",
    forMember(
      (dest) => dest.enforcementActionCode,
      mapFrom((src) => src.enforcement_action_code),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom(
        (src) =>
          src
            .enforcement_action_code_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code
            ?.short_description,
      ),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom(
        (src) =>
          src
            .enforcement_action_code_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code
            ?.long_description,
      ),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom(
        (src) =>
          src
            .enforcement_action_code_enforcement_action_code_agency_xref_enforcement_action_codeToenforcement_action_code
            ?.display_order,
      ),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code_ref),
    ),
  );
};
