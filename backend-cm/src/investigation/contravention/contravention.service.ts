import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "src/common/user.service";
import { CreateContraventionInput } from "src/investigation/contravention/dto/contravention";
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

  async create(contraventionInput: CreateContraventionInput): Promise<Investigation> {
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

        await tx.contravention_party_xref.create({
          data: {
            contravention_guid: contravention.contravention_guid,
            investigation_party_guid: contraventionInput.investigationPartyGuid,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        });
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
}
