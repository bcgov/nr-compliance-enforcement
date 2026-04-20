import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Ticket } from "../../../investigation/ticket/dto/ticket";
import { enforcement_action } from "../../../../prisma/investigation/generated/enforcement_action";
import { EnforcementActionCode } from "../../../../src/investigation/enforcement_action_code/dto/enforcement_action_code";

export class EnforcementAction {
  enforcementActionIdentifier: string;
  contraventionIdentifier: string;
  partyIdentifier: string;
  enforcementActionCode: EnforcementActionCode;
  dateIssued: Date;
  geoOrganizationUnitCode: string;
  appUserIdentifier: string;
  activeIndicator: boolean;
  ticket?: [Ticket];
}

export class CreateEnforcementActionInput {
  contraventionIdentifier: string;
  partyIdentifier: string;
  enforcementActionCode: string;
  dateIssued: Date;
  geoOrganizationUnitCode: string;
  appUserIdentifier: string;
  ticketOutcomeCode?: string;
  ticketAmount?: number;
  ticketNumber?: string;
}

export class UpdateEnforcementActionInput {
  enforcementActionIdentifier: string;
  enforcementActionCode?: string;
  dateIssued?: Date;
  geoOrganizationUnitCode?: string;
  appUserIdentifier?: string;
  ticketOutcomeCode?: string;
  ticketAmount?: number;
  ticketNumber?: string;
}

export const mapPrismaEnforcementActionToEnforcementAction = (mapper: Mapper) => {
  createMap<enforcement_action, EnforcementAction>(
    mapper,
    "enforcement_action",
    "EnforcementAction",
    forMember(
      (dest) => dest.enforcementActionIdentifier,
      mapFrom((src) => src.enforcement_action_guid),
    ),
    forMember(
      (dest) => dest.contraventionIdentifier,
      mapFrom((src) => src.contravention_party_xref.contravention_guid),
    ),
    forMember(
      (dest) => dest.partyIdentifier,
      mapFrom((src) => src.contravention_party_xref.investigation_party_guid),
    ),
    forMember(
      (dest) => dest.enforcementActionCode,
      mapFrom((src) =>
        mapper.map(
          src.enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code,
          "enforcement_action_code_agency_xref",
          "EnforcementActionCode",
        ),
      ),
    ),
    forMember(
      (dest) => dest.dateIssued,
      mapFrom((src) => src.date_issued),
    ),
    forMember(
      (dest) => dest.geoOrganizationUnitCode,
      mapFrom((src) => src.geo_organization_unit_code_ref),
    ),
    forMember(
      (dest) => dest.appUserIdentifier,
      mapFrom((src) => src.app_user_guid_ref),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.ticket,
      mapFrom((src) => (src.ticket?.length ? mapper.map(src.ticket[0], "ticket", "Ticket") : null)),
    ),
  );
};
