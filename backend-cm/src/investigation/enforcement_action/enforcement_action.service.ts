import { Injectable, Logger } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { UserService } from "../../common/user.service";
import {
  CreateEnforcementActionInput,
  EnforcementAction,
  UpdateEnforcementActionInput,
} from "src/investigation/enforcement_action/dto/enforcement_action";
import { withRlsTransaction } from "../../pg-session-extension/with-rls-transaction";
import { InvestigationService } from "../investigation/investigation.service";
import { InvestigationPartyService } from "../investigation_party/investigation_party_service";

// Every enforcement action code that has its own decision-detail table, and the table it maps
// to. Unfounded/Unresolved (comment only) and Violation Ticket (the pre-existing ticket table,
// handled separately) are intentionally excluded here.
const DECISION_DETAIL_TABLES = [
  "warning",
  "administrative_sanction",
  "enforcement_order",
  "restorative_justice",
  "court_prosecution",
  "administrative_penalty",
] as const;

type DecisionDetailTable = (typeof DECISION_DETAIL_TABLES)[number];

const activeDetailInclude = { where: { active_ind: true } };

const DECISION_DETAIL_INCLUDE = {
  warning: activeDetailInclude,
  administrative_sanction: activeDetailInclude,
  enforcement_order: activeDetailInclude,
  restorative_justice: activeDetailInclude,
  court_prosecution: activeDetailInclude,
  administrative_penalty: activeDetailInclude,
};

@Injectable()
export class EnforcementActionService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly investigationService: InvestigationService,
    private readonly investigationPartyService: InvestigationPartyService,
  ) {}

  private readonly logger = new Logger(EnforcementActionService.name);

  // Maps a decision code to the fields for its decision-detail table, given a flat
  // create/update input. Returns null for decisions with no dedicated table (Unfounded,
  // Unresolved, Violation Ticket - ticket is handled by the existing ticket-specific logic).
  private buildDecisionDetailData(
    code: string | undefined,
    input: CreateEnforcementActionInput | UpdateEnforcementActionInput,
  ): { table: DecisionDetailTable; data: Record<string, unknown> } | null {
    switch (code) {
      case "WARN":
        return { table: "warning", data: { warning_number: input.warningNumber } };
      case "ADSN":
        return {
          table: "administrative_sanction",
          data: {
            sanction_type_code: input.sanctionTypeCode,
            effective_date: input.effectiveDate,
            end_date: input.endDate,
            sanction_status_code: input.sanctionStatusCode,
            comment: input.comment ?? null,
          },
        };
      case "ORDR":
        return {
          table: "enforcement_order",
          data: {
            order_type_code: input.orderTypeCode ?? null,
            remediation_required_ind: input.remediationRequired ?? null,
            appeal_hearing_date: input.appealHearingDate ?? null,
            order_status_code: input.orderStatusCode,
          },
        };
      case "RJUS":
        return {
          table: "restorative_justice",
          data: {
            hearing_date: input.hearingDate ?? null,
            decision_date: input.decisionDate ?? null,
            remediation_required_ind: input.remediationRequired ?? null,
            comment: input.comment ?? null,
          },
        };
      case "CTPR":
        return {
          table: "court_prosecution",
          data: {
            approval_ind: input.approvalInd ?? null,
            remediation_required_ind: input.remediationRequired ?? null,
            court_prosecution_status_code: input.courtProsecutionStatusCode,
          },
        };
      case "ADPN":
        return {
          table: "administrative_penalty",
          data: {
            approval_ind: input.approvalInd ?? null,
            remediation_required_ind: input.remediationRequired ?? null,
            administrative_penalty_status_code: input.administrativePenaltyStatusCode,
            comment: input.comment ?? null,
          },
        };
      default:
        return null;
    }
  }

  // Soft-deletes any active row in every decision-detail table except the one currently
  // applicable (so switching decision types doesn't leave a stale detail row active), then
  // upserts the applicable one, if any.
  private async syncDecisionDetail(
    db: any,
    enforcementActionGuid: string,
    decisionDetail: { table: DecisionDetailTable; data: Record<string, unknown> } | null,
  ): Promise<void> {
    for (const table of DECISION_DETAIL_TABLES) {
      if (decisionDetail?.table === table) continue;
      await db[table].updateMany({
        where: { enforcement_action_guid: enforcementActionGuid, active_ind: true },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    }

    if (!decisionDetail) return;

    const existing = await db[decisionDetail.table].findFirst({
      where: { enforcement_action_guid: enforcementActionGuid, active_ind: true },
    });

    if (existing) {
      await db[decisionDetail.table].update({
        where: { [`${decisionDetail.table}_guid`]: existing[`${decisionDetail.table}_guid`] },
        data: {
          ...decisionDetail.data,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } else {
      await db[decisionDetail.table].create({
        data: {
          enforcement_action_guid: enforcementActionGuid,
          ...decisionDetail.data,
          active_ind: true,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      });
    }
  }

  async findMany(contraventionIdentifier: string, partyIdentifier: string): Promise<EnforcementAction[]> {
    const xref = await this.prisma.contravention_party_xref.findFirst({
      where: {
        contravention_guid: contraventionIdentifier,
        investigation_party_guid: partyIdentifier,
        active_ind: true,
      },
    });

    if (!xref) return [];

    const prismaEnforcementActions = await this.prisma.enforcement_action.findMany({
      where: {
        active_ind: true,
        contravention_party_xref_guid: xref.contravention_party_xref_guid,
      },
      orderBy: {
        create_utc_timestamp: "asc",
      },
      include: {
        ticket: {
          where: {
            active_ind: true,
          },
        },
        ...DECISION_DETAIL_INCLUDE,
        enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code: true,
        contravention_party_xref: {
          include: {
            contravention: true,
            enforcement_action: true,
          },
        },
      },
    });

    return this.mapper.mapArray(prismaEnforcementActions, "enforcement_action", "EnforcementAction");
  }

  async findOne(enforcementActionIdentifier: string): Promise<EnforcementAction> {
    const prismaEnforcementAction = await this.prisma.enforcement_action.findUnique({
      where: {
        enforcement_action_guid: enforcementActionIdentifier,
      },
      include: {
        contravention_party_xref: true,
        enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code: true,
        ticket: {
          where: {
            active_ind: true,
          },
        },
        ...DECISION_DETAIL_INCLUDE,
      },
    });

    return this.mapper.map(prismaEnforcementAction, "enforcement_action", "EnforcementAction");
  }

  async create(input: CreateEnforcementActionInput): Promise<EnforcementAction> {
    try {
      // Promoting investigation_party to shared schema when enforcement action is created against a known party

      // 1. Prepare the party for publishing with a random partyIdentifier
      const preparedParty = input.partyIdentifier
        ? await this.investigationPartyService.prepareSharedParty(input.partyIdentifier)
        : null;

      let enforcementAction;
      let sharedParty;

      // 2. Create enforcement action and update refs to prepared party
      await withRlsTransaction(this.prisma, async (db) => {
        // Looked up inside the transaction (rather than before it) so a concurrent request can't
        // race this read against the on-demand create below and produce two active null-party
        // xref rows for the same contravention.
        const existingXref = await db.contravention_party_xref.findFirst({
          where: {
            contravention_guid: input.contraventionIdentifier,
            investigation_party_guid: input.partyIdentifier ?? null,
            active_ind: true,
          },
          include: {
            contravention: true,
          },
        });

        if (!existingXref && input.partyIdentifier) {
          throw new Error(
            `No contravention party xref found for contravention ${input.contraventionIdentifier} and party ${input.partyIdentifier}`,
          );
        }

        const xref =
          existingXref ??
          (await db.contravention_party_xref.create({
            data: {
              contravention_guid: input.contraventionIdentifier,
              investigation_party_guid: null,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
            include: {
              contravention: true,
            },
          }));

        enforcementAction = await db.enforcement_action.create({
          data: {
            contravention_party_xref_guid: xref.contravention_party_xref_guid,
            enforcement_action_code: input.enforcementActionCode,
            date_issued: input.dateIssued,
            geo_organization_unit_code_ref: input.geoOrganizationUnitCode,
            app_user_guid_ref: input.appUserIdentifier,
            comment: input.comment ?? null,
            issuing_officer_guid_ref: input.issuingOfficerIdentifier ?? null,
            date_served: input.dateServed ?? null,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            ...(input.ticketOutcomeCode &&
              input.ticketAmount !== undefined && {
                ticket: {
                  create: {
                    ticket_outcome_code: input.ticketOutcomeCode,
                    ticket_amount: input.ticketAmount,
                    ticket_number: input.ticketNumber,
                    paid_date: input.paidDate,
                    ticket_type_code: input.ticketTypeCode ?? null,
                    appeal_hearing_date: input.appealHearingDate ?? null,
                    active_ind: true,
                    create_user_id: this.user.getIdirUsername(),
                    create_utc_timestamp: new Date(),
                  },
                },
              }),
          },
        });

        const decisionDetail = this.buildDecisionDetailData(input.enforcementActionCode, input);
        if (decisionDetail) {
          await db[decisionDetail.table].create({
            data: {
              enforcement_action_guid: enforcementAction.enforcement_action_guid,
              ...decisionDetail.data,
              active_ind: true,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });
        }

        // 3. Create the shared party in the shared schema
        if (preparedParty) {
          await this.investigationPartyService.linkToSharedParty(db, input.partyIdentifier!, preparedParty);
          sharedParty = await this.investigationPartyService.createSharedParty(preparedParty);
          await this.investigationPartyService.stampSharedPartyUpdate(
            db,
            input.partyIdentifier!,
            sharedParty.updatedDateTime,
          );
        }

        await this.investigationService.updateInvestigationTimestamp(xref.contravention.investigation_guid);
      });

      // Handed back so the client can copy the party's COMS attachments onto the new shared party
      const created = await this.findOne(enforcementAction.enforcement_action_guid);
      return { ...created, publishedPartyReference: sharedParty?.partyIdentifier ?? null };
    } catch (error) {
      this.logger.error("Error creating enforcement action:", error);
      throw error;
    }
  }

  async update(input: UpdateEnforcementActionInput): Promise<EnforcementAction> {
    try {
      const enforcementAction = await this.prisma.enforcement_action.findUnique({
        where: {
          enforcement_action_guid: input.enforcementActionIdentifier,
        },
        include: {
          contravention_party_xref: {
            include: {
              contravention: true,
            },
          },
        },
      });

      if (!enforcementAction) {
        throw new Error(`Enforcement action with guid ${input.enforcementActionIdentifier} not found`);
      }

      await withRlsTransaction(this.prisma, async (db) => {
        await db.enforcement_action.update({
          where: {
            enforcement_action_guid: input.enforcementActionIdentifier,
          },
          data: {
            enforcement_action_code: input.enforcementActionCode,
            date_issued: input.dateIssued,
            geo_organization_unit_code_ref: input.geoOrganizationUnitCode,
            app_user_guid_ref: input.appUserIdentifier,
            comment: input.comment ?? null,
            issuing_officer_guid_ref: input.issuingOfficerIdentifier ?? null,
            date_served: input.dateServed ?? null,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });

        const isViolationTicket = input.ticketOutcomeCode !== undefined && input.ticketAmount !== undefined;

        if (isViolationTicket) {
          const existingTicket = await db.ticket.findFirst({
            where: {
              enforcement_action_guid: input.enforcementActionIdentifier,
              active_ind: true,
            },
          });

          if (existingTicket) {
            await db.ticket.update({
              where: { ticket_guid: existingTicket.ticket_guid },
              data: {
                ticket_outcome_code: input.ticketOutcomeCode,
                ticket_amount: input.ticketAmount,
                ticket_number: input.ticketNumber,
                paid_date: input.paidDate,
                ticket_type_code: input.ticketTypeCode ?? null,
                appeal_hearing_date: input.appealHearingDate ?? null,
                update_user_id: this.user.getIdirUsername(),
                update_utc_timestamp: new Date(),
              },
            });
          } else {
            await db.ticket.create({
              data: {
                enforcement_action_guid: input.enforcementActionIdentifier,
                ticket_outcome_code: input.ticketOutcomeCode,
                ticket_amount: input.ticketAmount,
                ticket_number: input.ticketNumber,
                paid_date: input.paidDate,
                ticket_type_code: input.ticketTypeCode ?? null,
                appeal_hearing_date: input.appealHearingDate ?? null,
                active_ind: true,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }
        } else {
          // Soft delete any existing ticket if switching to non-ticket type
          await db.ticket.updateMany({
            where: {
              enforcement_action_guid: input.enforcementActionIdentifier,
              active_ind: true,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }

        const decisionDetail = this.buildDecisionDetailData(input.enforcementActionCode, input);
        await this.syncDecisionDetail(db, input.enforcementActionIdentifier, decisionDetail);
      });

      await this.investigationService.updateInvestigationTimestamp(
        enforcementAction.contravention_party_xref.contravention.investigation_guid,
      );

      return await this.findOne(input.enforcementActionIdentifier);
    } catch (error) {
      this.logger.error("Error updating enforcement action:", error);
      throw error;
    }
  }

  async remove(enforcementActionIdentifier: string): Promise<EnforcementAction> {
    try {
      const enforcementAction = await this.prisma.enforcement_action.findUnique({
        where: {
          enforcement_action_guid: enforcementActionIdentifier,
        },
        include: {
          contravention_party_xref: {
            include: {
              contravention: true,
            },
          },
        },
      });

      if (!enforcementAction) {
        throw new Error(`Enforcement action with guid ${enforcementActionIdentifier} not found`);
      }

      await withRlsTransaction(this.prisma, async (db) => {
        // Soft delete any associated ticket and decision-detail rows first
        await db.ticket.updateMany({
          where: {
            enforcement_action_guid: enforcementActionIdentifier,
            active_ind: true,
          },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });

        for (const table of DECISION_DETAIL_TABLES) {
          await db[table].updateMany({
            where: {
              enforcement_action_guid: enforcementActionIdentifier,
              active_ind: true,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }

        await db.enforcement_action.update({
          where: {
            enforcement_action_guid: enforcementActionIdentifier,
          },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      });

      await this.investigationService.updateInvestigationTimestamp(
        enforcementAction.contravention_party_xref.contravention.investigation_guid,
      );
    } catch (error) {
      this.logger.error("Error removing enforcement action:", error);
      throw error;
    }

    return await this.findOne(enforcementActionIdentifier);
  }
}
