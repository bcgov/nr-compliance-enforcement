import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "src/common/user.service";
import { CreateUpdateContraventionInput } from "src/investigation/contravention/dto/contravention";
import { Investigation } from "src/investigation/investigation/dto/investigation";
import { InvestigationService } from "src/investigation/investigation/investigation.service";
import { InvestigationPrismaService } from "src/prisma/investigation/prisma.investigation.service";

@Injectable()
export class ContraventionService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(ContraventionService.name);

  async create(contraventionInput: CreateUpdateContraventionInput): Promise<Investigation> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const contravention = await tx.contravention.create({
          data: {
            investigation_guid: contraventionInput.investigationGuid,
            legislation_guid_ref: contraventionInput.legislationReference,
            contravention_date: contraventionInput.date,
            geo_organization_unit_code_ref: contraventionInput.community,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        });

        const parties = contraventionInput.investigationPartyGuids;

        for (const party of parties) {
          await tx.contravention_party_xref.create({
            data: {
              contravention_guid: contravention.contravention_guid,
              investigation_party_guid: party,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error("Error adding contravention:", error);
      throw error;
    }

    return await this.investigationService.findOne(contraventionInput.investigationGuid);
  }

  async remove(investigationGuid: string, contraventionGuid: string, partyGuid: string | null): Promise<Investigation> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const contravention = await tx.contravention.findUnique({
          where: { contravention_guid: contraventionGuid },
          include: {
            contravention_party_xref: {
              where: { active_ind: true },
            },
          },
        });

        if (!contravention) throw new Error("Contravention not found");

        const otherParties = contravention.contravention_party_xref.filter(
          (xref) => xref.investigation_party_guid !== partyGuid,
        );

        if (otherParties.length > 0) {
          //Shared contravention — only deactivate this party's xref
          await tx.contravention_party_xref.updateMany({
            where: {
              contravention_guid: contraventionGuid,
              investigation_party_guid: partyGuid,
              active_ind: true,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });

          //Check if any active xrefs remain after deactivation
          const remainingXrefs = await tx.contravention_party_xref.count({
            where: {
              contravention_guid: contraventionGuid,
              active_ind: true,
            },
          });

          //If no parties left, deactivate the contravention itself
          if (remainingXrefs === 0) {
            await tx.contravention.update({
              where: { contravention_guid: contraventionGuid },
              data: {
                active_ind: false,
                update_user_id: this.user.getIdirUsername(),
                update_utc_timestamp: new Date(),
              },
            });
          }
        } else {
          //This is the only party — deactivate the contravention itself
          await tx.contravention.update({
            where: { contravention_guid: contraventionGuid },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error("Error removing contravention:", error);
      throw error;
    }

    return await this.investigationService.findOne(investigationGuid);
  }

  async update(contraventionGuid: string, input: CreateUpdateContraventionInput): Promise<Investigation> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const originalContravention = await tx.contravention.findUnique({
          where: { contravention_guid: contraventionGuid },
          include: {
            contravention_party_xref: {
              where: { active_ind: true },
            },
          },
        });

        if (!originalContravention) throw new Error("Contravention not found");

        const otherParties = originalContravention.contravention_party_xref.filter(
          (xref) => xref.investigation_party_guid !== input.selectedPartyGuid,
        );
        const isShared = otherParties.length > 0;

        if (isShared) {
          // Contravention is shared with other parties — split it:
          //Deactivate selectedPartyGuid xref on the original contravention
          await tx.contravention_party_xref.updateMany({
            where: {
              contravention_guid: contraventionGuid,
              investigation_party_guid: input.selectedPartyGuid,
              active_ind: true,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });

          //Create a new contravention with the updated legislation for selectedPartyGuid only
          const newContravention = await tx.contravention.create({
            data: {
              investigation_guid: originalContravention.investigation_guid,
              legislation_guid_ref: input.legislationReference,
              contravention_date: input.date,
              geo_organization_unit_code_ref: input.community,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });

          //Link selectedPartyGuid to the new contravention
          if (input.selectedPartyGuid) {
            await tx.contravention_party_xref.create({
              data: {
                contravention_guid: newContravention.contravention_guid,
                investigation_party_guid: input.selectedPartyGuid,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }
        } else {
          // Contravention belongs to selectedPartyGuid only — update in place as before
          await tx.contravention.update({
            where: { contravention_guid: contraventionGuid },
            data: {
              legislation_guid_ref: input.legislationReference,
              contravention_date: input.date,
              geo_organization_unit_code_ref: input.community,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error("Error updating contravention:", error);
      throw error;
    }

    return await this.investigationService.findOne(input.investigationGuid);
  }
}
