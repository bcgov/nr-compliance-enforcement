import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Ticket } from "../../../investigation/ticket/dto/ticket";
import { enforcement_action } from "../../../../prisma/investigation/generated/enforcement_action";
import { EnforcementActionCode } from "../../../../src/investigation/enforcement_action_code/dto/enforcement_action_code";

export class EnforcementAction {
  enforcementActionIdentifier: string;
  contraventionIdentifier: string;
  partyIdentifier: string | null; // null unknown party
  enforcementActionCode: EnforcementActionCode;
  dateIssued: Date;
  geoOrganizationUnitCode: string;
  appUserIdentifier: string;
  activeIndicator: boolean;
  ticket?: [Ticket];
  comment?: string;
  publishedPartyReference?: string; //For attachments in COMS
  // Mutual fields (all decisions except Unfounded/Unresolved)
  issuingOfficerIdentifier?: string;
  dateServed?: Date;
  // Warning
  warningNumber?: string;
  // Administrative Sanction
  sanctionTypeCode?: string;
  effectiveDate?: Date;
  endDate?: Date;
  sanctionStatusCode?: string;
  // Order
  orderTypeCode?: string;
  orderStatusCode?: string;
  // Restorative Justice
  hearingDate?: Date;
  decisionDate?: Date;
  // Court Prosecution
  courtProsecutionStatusCode?: string;
  // Administrative Penalty
  administrativePenaltyStatusCode?: string;
  // Shared across Order/Restorative Justice/Court Prosecution/Administrative Penalty
  remediationRequired?: boolean;
  // Shared across Order/Violation Ticket (ticket has its own appealHearingDate on Ticket)
  appealHearingDate?: Date;
  // Shared across Court Prosecution/Administrative Penalty
  approvalInd?: boolean;
}

export class CreateEnforcementActionInput {
  contraventionIdentifier: string;
  partyIdentifier?: string;
  enforcementActionCode: string;
  dateIssued: Date;
  geoOrganizationUnitCode: string;
  appUserIdentifier: string;
  ticketOutcomeCode?: string;
  ticketAmount?: number;
  ticketNumber?: string;
  paidDate?: Date;
  comment?: string;
  issuingOfficerIdentifier?: string;
  dateServed?: Date;
  ticketTypeCode?: string;
  warningNumber?: string;
  sanctionTypeCode?: string;
  effectiveDate?: Date;
  endDate?: Date;
  sanctionStatusCode?: string;
  orderTypeCode?: string;
  remediationRequired?: boolean;
  appealHearingDate?: Date;
  orderStatusCode?: string;
  hearingDate?: Date;
  decisionDate?: Date;
  courtProsecutionStatusCode?: string;
  administrativePenaltyStatusCode?: string;
  approvalInd?: boolean;
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
  paidDate?: Date;
  comment?: string;
  issuingOfficerIdentifier?: string;
  dateServed?: Date;
  ticketTypeCode?: string;
  warningNumber?: string;
  sanctionTypeCode?: string;
  effectiveDate?: Date;
  endDate?: Date;
  sanctionStatusCode?: string;
  orderTypeCode?: string;
  remediationRequired?: boolean;
  appealHearingDate?: Date;
  orderStatusCode?: string;
  hearingDate?: Date;
  decisionDate?: Date;
  courtProsecutionStatusCode?: string;
  administrativePenaltyStatusCode?: string;
  approvalInd?: boolean;
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
    forMember(
      (dest) => dest.comment,
      // Unfounded/Unresolved store comment directly; Administrative Sanction/Restorative
      // Justice/Administrative Penalty store it on their own decision-detail table.
      mapFrom(
        (src) =>
          src.comment ??
          src.administrative_sanction?.[0]?.comment ??
          src.restorative_justice?.[0]?.comment ??
          src.administrative_penalty?.[0]?.comment ??
          null,
      ),
    ),
    forMember(
      (dest) => dest.issuingOfficerIdentifier,
      mapFrom((src) => src.issuing_officer_guid_ref),
    ),
    forMember(
      (dest) => dest.dateServed,
      mapFrom((src) => src.date_served),
    ),
    forMember(
      (dest) => dest.warningNumber,
      mapFrom((src) => src.warning?.[0]?.warning_number),
    ),
    forMember(
      (dest) => dest.sanctionTypeCode,
      mapFrom((src) => src.administrative_sanction?.[0]?.sanction_type_code),
    ),
    forMember(
      (dest) => dest.effectiveDate,
      mapFrom((src) => src.administrative_sanction?.[0]?.effective_date),
    ),
    forMember(
      (dest) => dest.endDate,
      mapFrom((src) => src.administrative_sanction?.[0]?.end_date),
    ),
    forMember(
      (dest) => dest.sanctionStatusCode,
      mapFrom((src) => src.administrative_sanction?.[0]?.sanction_status_code),
    ),
    forMember(
      (dest) => dest.orderTypeCode,
      mapFrom((src) => src.enforcement_order?.[0]?.order_type_code),
    ),
    forMember(
      (dest) => dest.orderStatusCode,
      mapFrom((src) => src.enforcement_order?.[0]?.order_status_code),
    ),
    forMember(
      (dest) => dest.hearingDate,
      mapFrom((src) => src.restorative_justice?.[0]?.hearing_date),
    ),
    forMember(
      (dest) => dest.decisionDate,
      mapFrom((src) => src.restorative_justice?.[0]?.decision_date),
    ),
    forMember(
      (dest) => dest.courtProsecutionStatusCode,
      mapFrom((src) => src.court_prosecution?.[0]?.court_prosecution_status_code),
    ),
    forMember(
      (dest) => dest.administrativePenaltyStatusCode,
      mapFrom((src) => src.administrative_penalty?.[0]?.administrative_penalty_status_code),
    ),
    forMember(
      (dest) => dest.remediationRequired,
      mapFrom(
        (src) =>
          src.enforcement_order?.[0]?.remediation_required_ind ??
          src.restorative_justice?.[0]?.remediation_required_ind ??
          src.court_prosecution?.[0]?.remediation_required_ind ??
          src.administrative_penalty?.[0]?.remediation_required_ind ??
          null,
      ),
    ),
    forMember(
      (dest) => dest.appealHearingDate,
      mapFrom((src) => src.enforcement_order?.[0]?.appeal_hearing_date),
    ),
    forMember(
      (dest) => dest.approvalInd,
      mapFrom((src) => src.court_prosecution?.[0]?.approval_ind ?? src.administrative_penalty?.[0]?.approval_ind ?? null),
    ),
  );
};
