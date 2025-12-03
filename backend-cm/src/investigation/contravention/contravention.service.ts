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

  async remove(investigationGuid: string, contraventionGuid: string): Promise<Investigation> {
    try {
      await this.prisma.contravention.update({
        where: {
          contravention_guid: contraventionGuid,
        },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error removing contravention:", error);
      throw error;
    }
    return await this.investigationService.findOne(investigationGuid);
  }

  async update(contraventionGuid: string, input: CreateUpdateContraventionInput): Promise<Investigation> {
    try {
      const contraventionParties = await this.prisma.contravention_party_xref.findMany({
        select: {
          investigation_party_guid: true,
        },
        where: {
          contravention_guid: contraventionGuid,
          active_ind: true,
        },
      });

      const partiesToRemove = contraventionParties
        .map((p) => p.investigation_party_guid)
        .filter((guid) => !input.investigationPartyGuids.includes(guid));

      const partiesToAdd = input.investigationPartyGuids.filter(
        (guid) => !contraventionParties.some((p) => p.investigation_party_guid === guid),
      );

      await this.prisma.$transaction(async (tx) => {
        // Update the legislation ref if required
        await tx.contravention.update({
          where: {
            contravention_guid: contraventionGuid,
          },
          data: {
            legislation_guid_ref: input.legislationReference,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });

        // Remove any parties that we don't want
        for (const party of partiesToRemove) {
          await tx.contravention_party_xref.updateMany({
            where: {
              investigation_party_guid: party,
            },
            data: {
              active_ind: false,
            },
          });
        }

        // Add the new parties
        for (const party of partiesToAdd) {
          await tx.contravention_party_xref.create({
            data: {
              contravention_guid: contraventionGuid,
              investigation_party_guid: party,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
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
