import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "src/common/user.service";
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

  async create(investigationGuid: string, legsislationGuidRef: string): Promise<Investigation> {
    try {
      await this.prisma.contravention.create({
        data: {
          investigation_guid: investigationGuid,
          legislation_guid_ref: legsislationGuidRef,
          active_ind: true,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error adding contravention:", error);
      throw error;
    }

    return await this.investigationService.findOne(investigationGuid);
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
