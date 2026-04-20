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

@Injectable()
export class EnforcementActionService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(EnforcementActionService.name);

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
      },
    });

    return this.mapper.map(prismaEnforcementAction, "enforcement_action", "EnforcementAction");
  }

  async create(input: CreateEnforcementActionInput): Promise<EnforcementAction> {
    try {
      const xref = await this.prisma.contravention_party_xref.findFirst({
        where: {
          contravention_guid: input.contraventionIdentifier,
          investigation_party_guid: input.partyIdentifier,
          active_ind: true,
        },
      });

      if (!xref) {
        throw new Error(
          `No contravention party xref found for contravention ${input.contraventionIdentifier} and party ${input.partyIdentifier}`,
        );
      }

      const enforcementAction = await this.prisma.enforcement_action.create({
        data: {
          contravention_party_xref_guid: xref.contravention_party_xref_guid,
          enforcement_action_code: input.enforcementActionCode,
          date_issued: input.dateIssued,
          geo_organization_unit_code_ref: input.geoOrganizationUnitCode,
          app_user_guid_ref: input.appUserIdentifier,
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
                  active_ind: true,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                },
              },
            }),
        },
      });

      return await this.findOne(enforcementAction.enforcement_action_guid);
    } catch (error) {
      this.logger.error("Error creating enforcement action:", error);
      throw error;
    }
  }

  async update(input: UpdateEnforcementActionInput): Promise<EnforcementAction> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.enforcement_action.update({
          where: {
            enforcement_action_guid: input.enforcementActionIdentifier,
          },
          data: {
            enforcement_action_code: input.enforcementActionCode,
            date_issued: input.dateIssued,
            geo_organization_unit_code_ref: input.geoOrganizationUnitCode,
            app_user_guid_ref: input.appUserIdentifier,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });

        // If ticket fields are provided, upsert the ticket
        if (input.ticketOutcomeCode !== undefined && input.ticketAmount !== undefined) {
          const existingTicket = await tx.ticket.findFirst({
            where: {
              enforcement_action_guid: input.enforcementActionIdentifier,
              active_ind: true,
            },
          });

          if (existingTicket) {
            await tx.ticket.update({
              where: {
                ticket_guid: existingTicket.ticket_guid,
              },
              data: {
                ticket_outcome_code: input.ticketOutcomeCode,
                ticket_amount: input.ticketAmount,
                ticket_number: input.ticketNumber,
                update_user_id: this.user.getIdirUsername(),
                update_utc_timestamp: new Date(),
              },
            });
          } else {
            await tx.ticket.create({
              data: {
                enforcement_action_guid: input.enforcementActionIdentifier,
                ticket_outcome_code: input.ticketOutcomeCode,
                ticket_amount: input.ticketAmount,
                ticket_number: input.ticketNumber,
                active_ind: true,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }
        }
      });

      return await this.findOne(input.enforcementActionIdentifier);
    } catch (error) {
      this.logger.error("Error updating enforcement action:", error);
      throw error;
    }
  }

  async remove(enforcementActionIdentifier: string): Promise<EnforcementAction> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Soft delete any associated ticket first
        await tx.ticket.updateMany({
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

        await tx.enforcement_action.update({
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
    } catch (error) {
      this.logger.error("Error removing enforcement action:", error);
      throw error;
    }

    return await this.findOne(enforcementActionIdentifier);
  }
}
